#import "QuickBase64.h"
#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#import "react-native-quick-base64.h"

@implementation QuickBase64

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (void)setBridge:(RCTBridge *)bridge
{
  _bridge = bridge;
  _setBridgeOnMainQueue = RCTIsMainQueue();

  RCTCxxBridge *cxxBridge = (RCTCxxBridge *)self.bridge;
  if (!cxxBridge.runtime) {
    return;
  }

  [bridge dispatchBlock:^{
    installBase64(*(facebook::jsi::Runtime *)cxxBridge.runtime);
  } queue:RCTJSThread];
}

- (void)invalidate {
  cleanupBase64();
}

@end
