#include "react-native-quick-base64.h"
#include "base64.h"

#include <iostream>
#include <memory>

using namespace facebook;

// Owns a decoded std::string. JSI holds the shared_ptr alive for the
// ArrayBuffer's lifetime — no memcpy needed.
namespace {
class DecodedBuffer final : public jsi::MutableBuffer {
public:
  explicit DecodedBuffer(std::string&& s) noexcept : data_(std::move(s)) {}
  size_t size() const override { return data_.size(); }
  uint8_t* data() override {
    return reinterpret_cast<uint8_t*>(data_.data());
  }
private:
  std::string data_;
};
} // namespace

void installBase64(jsi::Runtime& jsiRuntime) {
  std::cout << "Initializing react-native-quick-base64" << "\n";

  auto base64FromArrayBuffer = jsi::Function::createFromHostFunction(
      jsiRuntime,
      jsi::PropNameID::forAscii(jsiRuntime, "base64FromArrayBuffer"),
      1,  // string
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments, size_t count) -> jsi::Value {
        if (count == 0) {
          return jsi::Value(-1);
        }
        bool url = false;
        if (count > 1 && arguments[1].isBool()) {
          url = arguments[1].asBool();
        }
        try {
          std::string strBase64;
          if (arguments[0].isObject()) {
            auto obj = arguments[0].asObject(runtime);
            if (!obj.isArrayBuffer(runtime)) {
              return jsi::Value(-1);
            }
            auto buf = obj.getArrayBuffer(runtime);
            strBase64 = base64_encode(buf.data(runtime), buf.size(runtime), url);
          } else if (arguments[0].isString()) {
            std::string str = arguments[0].asString(runtime).utf8(runtime);
            strBase64 = base64_encode(str, url);
          } else {
            return jsi::Value(-1);
          }
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
        if (count == 0 || !arguments[0].isString()) {
          return jsi::Value(-1);
        }

        std::string strBase64 = arguments[0].getString(runtime).utf8(runtime);
        bool removeLinebreaks = false;
        if (count > 1 && arguments[1].isBool()) {
          removeLinebreaks = arguments[1].asBool();
        }
        try {
          std::string decoded = base64_decode(strBase64, removeLinebreaks);
          auto buf = std::make_shared<DecodedBuffer>(std::move(decoded));
          return jsi::ArrayBuffer(runtime, std::move(buf));
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
