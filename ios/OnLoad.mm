#import <Foundation/Foundation.h>
#import "QuickBase64Impl.h"
#import <ReactCommon/CxxTurboModuleUtils.h>

@interface QuickBase64OnLoad : NSObject
@end

@implementation QuickBase64OnLoad

using namespace facebook::react;

+ (void)load
{
  registerCxxModuleToGlobalModuleMap(
    std::string(QuickBase64Impl::kModuleName),
    [](std::shared_ptr<CallInvoker> jsInvoker) {
      return std::make_shared<QuickBase64Impl>(jsInvoker);
    }
  );
}

@end
