#pragma once

#include <QuickBase64SpecJSI.h>

#include <memory>

namespace facebook::react {

class QuickBase64Impl : public NativeQuickBase64CxxSpec<QuickBase64Impl> {
public:
  QuickBase64Impl(std::shared_ptr<CallInvoker> jsInvoker);

  jsi::String base64FromArrayBuffer(jsi::Runtime& rt, jsi::Object buf, bool urlSafe);
  jsi::Object base64ToArrayBuffer(jsi::Runtime& rt, jsi::String b64, bool removeLinebreaks);
};

}
