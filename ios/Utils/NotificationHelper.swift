//
//  NotificationHelper.swift
//  Uway
//
//  Created by Furkan Ceylan on 19.06.25.
//

import Foundation
import UserNotifications

@objc class NotificationHelper: NSObject {
    
    @objc static func showNotification(
        title: String,
        body: String,
        categoryId: String = "NAVIGATION_ALERT",
        id: String = UUID().uuidString,
        playSound: Bool = true,
        vibrate: Bool = true
    ) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = playSound ? .default : nil
        content.categoryIdentifier = categoryId

        if vibrate {
            content.sound = .defaultCritical
        }

        let request = UNNotificationRequest(
            identifier: id,
            content: content,
            trigger: nil
        )

        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("❌ Notification error: \(error.localizedDescription)")
            }
        }
    }

    @objc static func setupCategories() {
        let alertCategory = UNNotificationCategory(
            identifier: "NAVIGATION_ALERT",
            actions: [],
            intentIdentifiers: [],
            options: .customDismissAction
        )

        UNUserNotificationCenter.current().setNotificationCategories([alertCategory])
    }
}
