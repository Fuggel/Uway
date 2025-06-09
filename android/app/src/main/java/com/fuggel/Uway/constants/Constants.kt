package com.fuggel.Uway.constants

object Constants {
    const val NAVIGATION_CHANNEL_ID = "navigation_channel"
    const val ALERT_CHANNEL_ID = "alert_channel"
    const val FOREGROUND_NOTIFICATION_ID = 1
    const val WARNING_NOTIFICATION_ID = 2
    const val USER_LOCATION = "user-location"
    const val WARNING_MANAGER = "warning-manager"
    const val WARNING_TYPE_INCIDENT = "incident"
    const val WARNING_TYPE_SPEED_CAMERA = "speed-camera"

    val VALID_WARNING_TYPES = setOf(WARNING_TYPE_INCIDENT, WARNING_TYPE_SPEED_CAMERA)
    val VALID_WARNING_STATES = setOf("early", "late")
}