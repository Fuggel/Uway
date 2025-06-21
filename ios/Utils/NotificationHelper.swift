//
//  NotificationHelper.swift
//  Uway
//
//  Created by Furkan Ceylan on 19.06.25.
//

import Foundation
import UserNotifications

@objc class NotificationHelper: NSObject {
    @objc static func showNotification(title: String, body: String) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        content.categoryIdentifier = "NAVIGATION_ALERT"

        let request = UNNotificationRequest(
            identifier: UUID().uuidString,
            content: content,
            trigger: nil
        )

        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("Notification error: \(error.localizedDescription)")
            }
        }
    }

    @objc static func setupCategories() {
        let category = UNNotificationCategory(
            identifier: "NAVIGATION_ALERT",
            actions: [],
            intentIdentifiers: [],
            options: .customDismissAction
        )
        UNUserNotificationCenter.current().setNotificationCategories([category])
    }
}
