#include "react-native-quick-base64.h"
#include "base64.h"

#include <iostream>
#include <sstream>

using namespace facebook;

// Returns false if the passed value is not a string or an ArrayBuffer.
bool valueToString(jsi::Runtime& runtime, const jsi::Value& value, std::string* str) {
  if (value.isString()) {
    *str = value.asString(runtime).utf8(runtime);
    return true;
  }

  if (value.isObject()) {
    auto obj = value.asObject(runtime);
    if (!obj.isArrayBuffer(runtime)) {
      return false;
    }
    auto buf = obj.getArrayBuffer(runtime);
    *str = std::string((char*)buf.data(runtime), buf.size(runtime));
    return true;
  }

  return false;
}

void installBase64(jsi::Runtime& jsiRuntime) {
  std::cout << "Initializing react-native-quick-base64" << "\n";

  auto base64FromArrayBuffer = jsi::Function::createFromHostFunction(
      jsiRuntime,
      jsi::PropNameID::forAscii(jsiRuntime, "base64FromArrayBuffer"),
      1,  // string
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments, size_t count) -> jsi::Value {
        std::string str;
        if(!valueToString(runtime, arguments[0], &str)) {
          return jsi::Value(-1);
        }
        bool url = false;
        if (arguments[1].isBool()) {
          url = arguments[1].asBool();
        }
        try {
          std::string strBase64 = base64_encode(str, url);
          return jsi::Value(jsi::String::createFromUtf8(runtime, strBase64));
        } catch (const std::runtime_error& error) {
          throw jsi::JSError(runtime, error.what());
        } catch (...) {
          throw jsi::JSError(runtime, "unknown encoding error");
        }
      }
  );
  jsiRuntime.global().setProperty(jsiRuntime, "base64FromArrayBuffer", std::move(base64FromArrayBuffer));

  auto base64ToArrayBuffer = jsi::Function::createFromHostFunction(
      jsiRuntime,
      jsi::PropNameID::forAscii(jsiRuntime, "base64ToArrayBuffer"),
      1,  // string
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments, size_t count) -> jsi::Value {
        if (!arguments[0].isString()) {
          return jsi::Value(-1);
        }

        std::string strBase64 = arguments[0].getString(runtime).utf8(runtime);
        bool removeLinebreaks = false;
        if (arguments[1].isBool()) {
          removeLinebreaks = arguments[1].asBool();
        }
        try {
          std::string str = base64_decode(strBase64, removeLinebreaks);
          jsi::Function arrayBufferCtor = runtime.global().getPropertyAsFunction(runtime, "ArrayBuffer");
          jsi::Object o = arrayBufferCtor.callAsConstructor(runtime, (int)str.length()).getObject(runtime);
          jsi::ArrayBuffer buf = o.getArrayBuffer(runtime);
          memcpy(buf.data(runtime), str.c_str(), str.size());
          return o;
        } catch (const std::runtime_error& error) {
          throw jsi::JSError(runtime, error.what());
        } catch (...) {
          throw jsi::JSError(runtime, "unknown decoding error");
        }
      }
  );
  jsiRuntime.global().setProperty(jsiRuntime, "base64ToArrayBuffer", std::move(base64ToArrayBuffer));
}

void cleanupBase64() {
}
