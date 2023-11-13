#import <Foundation/Foundation.h>
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <EXUpdates/EXUpdatesAppController.h> 
#import <Expo/Expo.h>

@interface AppDelegate : EXAppDelegateWrapper <RCTBridgeDelegate, EXUpdatesAppControllerDelegate>

@end
