#include "QuickBase64Impl.h"
#include "base64.h"

#include <memory>
#include <stdexcept>

namespace facebook::react {

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

QuickBase64Impl::QuickBase64Impl(std::shared_ptr<CallInvoker> jsInvoker)
  : NativeQuickBase64CxxSpec(std::move(jsInvoker)) {}

jsi::String QuickBase64Impl::base64FromArrayBuffer(
  jsi::Runtime& rt,
  jsi::Object buf,
  bool urlSafe
) {
  if (!buf.isArrayBuffer(rt)) {
    throw jsi::JSError(rt, "base64FromArrayBuffer: argument must be an ArrayBuffer");
  }
  auto arrayBuffer = buf.getArrayBuffer(rt);
  try {
    std::string encoded = base64_encode(arrayBuffer.data(rt), arrayBuffer.size(rt), urlSafe);
    return jsi::String::createFromUtf8(rt, encoded);
  } catch (const std::runtime_error& e) {
    throw jsi::JSError(rt, e.what());
  } catch (...) {
    throw jsi::JSError(rt, "unknown encoding error");
  }
}

jsi::Object QuickBase64Impl::base64ToArrayBuffer(
  jsi::Runtime& rt,
  jsi::String b64,
  bool removeLinebreaks
) {
  try {
    std::string decoded = base64_decode(b64.utf8(rt), removeLinebreaks);
    auto buf = std::make_shared<DecodedBuffer>(std::move(decoded));
    return jsi::ArrayBuffer(rt, std::move(buf));
  } catch (const std::runtime_error& e) {
    throw jsi::JSError(rt, e.what());
  } catch (...) {
    throw jsi::JSError(rt, "unknown decoding error");
  }
}

}
