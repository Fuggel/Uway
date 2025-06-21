//
//  AppConfig.swift
//  Uway
//
//  Created by Furkan Ceylan on 20.06.25.
//

import Foundation

class AppConfig {
    static var uwayApiUrl: String = "https://uway-backend-3kp6.onrender.com/api"
    static var uwayWsUrl: String = "https://uway-backend-3kp6.onrender.com"
    static var gpsWarningThreshold: Int = 250
    static var distanceThresholdInMeters: Int = 50
    static var speechCooldownInMs: Int = 30_000
    static var routeDeviationThresholdInMeters: Int = 30
    static var uTurnAngleMin: Int = 150
    static var uTurnAngleMax: Int = 210
}
