package com.fuggel.Uway.modules

import android.content.Intent
import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.fuggel.Uway.service.NavigationService

class NavigationModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "NavigationModule"

    @ReactMethod
    fun startNavigationService() {
        val intent = Intent(reactContext, NavigationService::class.java)

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
