package com.fuggel.Uway.constants

object Constants {
    const val CHANNEL_ID = "navigation_channel"
    const val FOREGROUND_NOTIFICATION_ID = 1
    const val WARNING_NOTIFICATION_ID = 2
    const val SOCKET_URL = "http://192.168.178.33:8001"
    const val USER_LOCATION = "user-location"
    const val WARNING_MANAGER = "warning-manager"

    val VALID_WARNING_TYPES = setOf("incident", "speed-camera")
    val VALID_WARNING_STATES = setOf("early", "late")
}