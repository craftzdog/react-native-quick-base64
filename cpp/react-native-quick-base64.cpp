#include "react-native-quick-base64.h"
#include "simdutf.h"

#include <algorithm>
#include <iostream>

using namespace facebook;

static simdutf::base64_options b64opts(bool url) noexcept {
  return url ? simdutf::base64_url : simdutf::base64_default;
}

// Mirrors v8base64::decode (V8 builtins-typed-array.cc lines 513–516).
// loose lastChunkHandling: accepts inputs without '=' padding.
// decode_up_to_bad_char: mirrors V8's ArrayBufferFromBase64 (line 516).
// base64_default_or_url: accepts both standard (+/) and URL-safe (-_) alphabets.
static std::string decode(const std::string& input) {
  size_t max_len = simdutf::maximal_binary_length_from_base64(input.data(), input.size());
  std::string result(max_len, '\0');
  size_t out_len = max_len;
  auto r = simdutf::base64_to_binary_safe(
      input.data(), input.size(), result.data(), out_len,
      simdutf::base64_default_or_url,
      simdutf::last_chunk_handling_options::loose,
      /*decode_up_to_bad_char*/ true);
  if (r.error != simdutf::error_code::SUCCESS) {
    throw std::runtime_error("Input is not valid base64-encoded data");
  }
  result.resize(out_len);
  return result;
}

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
        if(count > 0 && !valueToString(runtime, arguments[0], &str)) {
          return jsi::Value(-1);
        }
        bool url = false;
        if (count > 1 && arguments[1].isBool()) {
          url = arguments[1].asBool();
        }
        try {
          auto opts = b64opts(url);
          std::string strBase64(simdutf::base64_length_from_binary(str.size(), opts), '\0');
          auto outlen = simdutf::binary_to_base64(str.data(), str.size(), strBase64.data(), opts);
          strBase64.resize(outlen);
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
        if (count > 0 && !arguments[0].isString()) {
          return jsi::Value(-1);
        }

        std::string strBase64 = arguments[0].getString(runtime).utf8(runtime);
        bool removeLinebreaks = false;
        if (count > 1 && arguments[1].isBool()) {
          removeLinebreaks = arguments[1].asBool();
        }
        try {
          if (removeLinebreaks) {
            strBase64.erase(std::remove(strBase64.begin(), strBase64.end(), '\n'), strBase64.end());
          } else if (strBase64.find('\n') != std::string::npos) {
            throw std::runtime_error("Input is not valid base64-encoded data");
          }
          std::string str = decode(strBase64);
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
