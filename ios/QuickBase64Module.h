#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "../cpp/react-native-quick-base64.h"

@interface QuickBase64Module : NSObject <RCTBridgeModule>

@property (nonatomic, assign) BOOL setBridgeOnMainQueue;

@end
