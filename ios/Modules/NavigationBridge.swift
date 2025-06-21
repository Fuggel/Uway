//
//  NavigationBridge.swift
//  Uway
//
//  Created by Furkan Ceylan on 21.06.25.
//

import Foundation

@objc class NavigationBridge: NSObject {
    @objc static let shared = NavigationBridge()

    @objc func startWithParams(_ params: NSDictionary) {
        NavigationService.shared.start(params: params)
    }

    @objc func stop() {
        NavigationService.shared.stop()
    }
}

