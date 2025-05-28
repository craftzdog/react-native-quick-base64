#import "QuickBase64Module.h"
#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#import "../cpp/react-native-quick-base64.h"

@implementation QuickBase64Module

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;

RCT_EXPORT_MODULE(QuickBase64)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (void)setBridge:(RCTBridge *)bridge {
  _bridge = bridge;
  _setBridgeOnMainQueue = RCTIsMainQueue();
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(install) {
  RCTCxxBridge *cxxBridge = (RCTCxxBridge *)_bridge;
  if (cxxBridge == nil || cxxBridge.runtime == nil) {
    NSLog(@"[QuickBase64] Could not access JSI runtime");
    return @false;
  }

  @try {
    NSLog(@"[QuickBase64] Installing JSI bindings...");
    installBase64(*(facebook::jsi::Runtime *)cxxBridge.runtime);
    NSLog(@"[QuickBase64] JSI bindings installed");
    return @true;
  } @catch (NSException *exception) {
    NSLog(@"[QuickBase64] Failed to install: %@", exception.reason);
    return @false;
  }
}

- (void)invalidate {
  cleanupBase64();
}

@end
