#include "QuickBase64Impl.h"
#include "base64.h"

#include <cstring>
#include <stdexcept>

namespace facebook::react {

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
  std::string decoded;
  try {
    decoded = base64_decode(b64.utf8(rt), removeLinebreaks);
  } catch (const std::runtime_error& e) {
    throw jsi::JSError(rt, e.what());
  } catch (...) {
    throw jsi::JSError(rt, "unknown decoding error");
  }

  auto arrayBufferCtor = rt.global().getPropertyAsFunction(rt, "ArrayBuffer");
  auto obj = arrayBufferCtor.callAsConstructor(rt, static_cast<int>(decoded.length())).getObject(rt);
  auto arrayBuffer = obj.getArrayBuffer(rt);
  std::memcpy(arrayBuffer.data(rt), decoded.c_str(), decoded.size());
  return obj;
}

}
