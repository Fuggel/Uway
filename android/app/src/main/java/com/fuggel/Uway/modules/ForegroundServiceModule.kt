package com.fuggel.Uway.modules

import android.content.Intent
import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.fuggel.Uway.services.ForegroundService

class ForegroundServiceModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "ForegroundServiceModule"

    @ReactMethod
    fun announce(text: String, title: String) {
        val intent = Intent(reactContext, ForegroundService::class.java)
        intent.putExtra("message", text)
        intent.putExtra("title", title)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(intent)
        } else {
            reactContext.startService(intent)
        }
    }

    @ReactMethod
    fun stopService() {
        val intent = Intent(reactContext, ForegroundService::class.java)
        reactContext.stopService(intent)
    }
}