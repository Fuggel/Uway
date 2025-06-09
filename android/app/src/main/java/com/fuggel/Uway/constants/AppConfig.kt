package com.fuggel.Uway.constants

object AppConfig {
    var uwayApiUrl: String = "https://uway-backend-3kp6.onrender.com/api"
    var uwayWsUrl: String = "https://uway-backend-3kp6.onrender.com"
    var gpsWarningThreshold: Int = 250
    var distanceThresholdInMeters: Int = 50
    var speechCooldownInMs: Long = 30_000L
    var routeDeviationThresholdInMeters: Int = 30
    var uTurnAngleMin: Int = 150
    var uTurnAngleMax: Int = 210
}