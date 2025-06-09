package com.fuggel.Uway.constants

object Constants {
    const val CHANNEL_ID = "navigation_channel"
    const val FOREGROUND_NOTIFICATION_ID = 1
    const val WARNING_NOTIFICATION_ID = 2
    const val UWAY_BACKEND_HOST = "192.168.178.33"
    const val UWAY_BACKEND_PORT = 8001
    const val SOCKET_URL = "http://192.168.178.33:8001"
    const val USER_LOCATION = "user-location"
    const val WARNING_MANAGER = "warning-manager"
    const val WARNING_TYPE_INCIDENT = "incident"
    const val WARNING_TYPE_SPEED_CAMERA = "speed-camera"

    val VALID_WARNING_TYPES = setOf(WARNING_TYPE_INCIDENT, WARNING_TYPE_SPEED_CAMERA)
    val VALID_WARNING_STATES = setOf("early", "late")
}