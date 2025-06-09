package com.fuggel.Uway.modules

import android.content.Intent
import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.fuggel.Uway.service.NavigationService

class NavigationModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "NavigationModule"

    @ReactMethod
    fun startNavigationService(params: ReadableMap) {
        val authToken = params.getString("authToken") ?: ""
        val isNavigationEnabled = params.getBoolean("isNavigationEnabled")
        val destinationCoordinates = params.getString("destinationCoordinates") ?: ""
        val excludeTypes = params.getString("exclude") ?: ""
        val profileType = params.getString("profileType") ?: ""
        val selectedRoute = params.getInt("selectedRoute")
        val allowTextToSpeech = params.getBoolean("allowTextToSpeech")

        val incidentOptions = params.getMap("incidentOptions")
        val speedCameraOptions = params.getMap("speedCameraOptions")

        val showIncidents = incidentOptions?.getBoolean("showIncidents") ?: false
        val playIncidentAcousticWarning =
            incidentOptions?.getBoolean("playAcousticWarning") ?: false

        val showSpeedCameras = speedCameraOptions?.getBoolean("showSpeedCameras") ?: false
        val playSpeedCameraAcousticWarning =
            speedCameraOptions?.getBoolean("playAcousticWarning") ?: false

        val intent = Intent(reactContext, NavigationService::class.java).apply {
            putExtra("authToken", authToken)
            putExtra("isNavigationEnabled", isNavigationEnabled)
            putExtra("destinationCoordinates", destinationCoordinates)
            putExtra("exclude", excludeTypes)
            putExtra("profileType", profileType)
            putExtra("selectedRoute", selectedRoute)
            putExtra("allowTextToSpeech", allowTextToSpeech)
            putExtra("showIncidents", showIncidents)
            putExtra("playIncidentAcousticWarning", playIncidentAcousticWarning)
            putExtra("showSpeedCameras", showSpeedCameras)
            putExtra("playSpeedCameraAcousticWarning", playSpeedCameraAcousticWarning)
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(intent)
        } else {
            reactContext.startService(intent)
        }
    }

    @ReactMethod
    fun stopNavigationService() {
        val intent = Intent(reactContext, NavigationService::class.java)
        reactContext.stopService(intent)
    }
}
