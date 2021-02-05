#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "react-native-quick-base64.h"

@interface QuickBase64 : NSObject <RCTBridgeModule>

@property (nonatomic, assign) BOOL setBridgeOnMainQueue;

@end
