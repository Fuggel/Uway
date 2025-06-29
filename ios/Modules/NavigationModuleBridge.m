//
//  NavigationModuleBridge.m
//  Uway
//
//  Created by Furkan Ceylan on 27.06.25.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NavigationModule, NSObject)

RCT_EXTERN_METHOD(startNavigationService:(NSDictionary *)params)
RCT_EXTERN_METHOD(stopNavigationService)

@end

