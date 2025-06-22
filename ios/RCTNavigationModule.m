#import "RCTNavigationModule.h"
#import <React/RCTLog.h>
#import "Uway-Swift.h"

@implementation RCTNavigationModule

RCT_EXPORT_MODULE(NavigationModule);

RCT_EXPORT_METHOD(startNavigationService:(NSDictionary *)params)
{
  RCTLogInfo(@"[backgroundtask] startNavigationService called with params: %@", params);
  [NavigationBridge.shared startWithParams:params];
}

RCT_EXPORT_METHOD(stopNavigationService)
{
  RCTLogInfo(@"[backgroundtask] stopNavigationService called");
  [NavigationBridge.shared stop];
}

@end

