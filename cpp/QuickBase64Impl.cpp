#include "QuickBase64Impl.h"
#include "simdutf.h"

#include <algorithm>
#include <memory>
#include <stdexcept>
#include <string>

namespace facebook::react {

namespace {

// Owns a decoded std::string. JSI holds the shared_ptr alive for the
// ArrayBuffer's lifetime — no memcpy needed.
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

// Mirrors V8's Uint8Array.fromBase64 (TC39-aligned):
// - last_chunk_handling_options::loose accepts inputs without '=' padding
// - decode_up_to_bad_char mirrors V8's ArrayBufferFromBase64
// - base64_default_or_url accepts both standard (+/) and URL-safe (-_) alphabets
std::string decodeBase64(const std::string& input) {
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
    auto opts = urlSafe ? simdutf::base64_url : simdutf::base64_default;
    size_t in_len = arrayBuffer.size(rt);
    std::string encoded(simdutf::base64_length_from_binary(in_len, opts), '\0');
    simdutf::binary_to_base64(
        reinterpret_cast<const char*>(arrayBuffer.data(rt)),
        in_len,
        encoded.data(),
        opts);
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
    std::string input = b64.utf8(rt);
    if (removeLinebreaks) {
      input.erase(std::remove(input.begin(), input.end(), '\n'), input.end());
    } else if (input.find('\n') != std::string::npos) {
      throw std::runtime_error("Input is not valid base64-encoded data");
    }
    std::string decoded = decodeBase64(input);
    auto buf = std::make_shared<DecodedBuffer>(std::move(decoded));
    return jsi::ArrayBuffer(rt, std::move(buf));
  } catch (const std::runtime_error& e) {
    throw jsi::JSError(rt, e.what());
  } catch (...) {
    throw jsi::JSError(rt, "unknown decoding error");
  }
}

}
