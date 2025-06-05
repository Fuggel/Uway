package com.fuggel.Uway.service

import android.Manifest
import android.app.Service
import android.content.Intent
import android.content.pm.PackageManager
import android.os.IBinder
import android.os.Looper
import androidx.core.content.ContextCompat
import com.fuggel.Uway.constants.Constants
import com.fuggel.Uway.model.Warning
import com.fuggel.Uway.model.WarningLogic
import com.fuggel.Uway.socket.SocketIOClient
import com.fuggel.Uway.utils.NotificationHelper
import com.google.android.gms.location.*
import org.json.JSONObject
import com.fuggel.Uway.R
import com.fuggel.Uway.utils.getIncidentIcon

class NavigationService : Service() {

    private val hasPlayedWarning = mutableMapOf<Pair<String?, String?>, Boolean>()

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationRequest: LocationRequest
    private lateinit var socketIOClient: SocketIOClient
    private lateinit var ttsManager: TTSManager

    override fun onCreate() {
        super.onCreate()
        NotificationHelper.createNotificationChannel(this)
        initTTS()

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        locationRequest = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 2000L)
            .setMinUpdateIntervalMillis(1500L)
            .build()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        socketIOClient = SocketIOClient(Constants.SOCKET_URL) { message ->
            handleWarningMessage(message)
        }

        socketIOClient.connect {
            startLocationUpdates()
        }

        startForeground(
            Constants.FOREGROUND_NOTIFICATION_ID,
            NotificationHelper.buildNotification(this)
        )
        startLocationUpdates()
        return START_STICKY
    }

    private fun handleWarningMessage(message: String) {
        val json = JSONObject(message)
        val warning = Warning(
            type = json.optString("warningType").takeIf { it.isNotEmpty() },
            state = json.optString("warningState").takeIf { it.isNotEmpty() },
            text = json.optString("text").takeIf { it.isNotEmpty() },
            tts = json.optString("textToSpeech").takeIf { it.isNotEmpty() }
        )

        if (!WarningLogic.isValid(warning)) {
            hasPlayedWarning.clear()
            return
        }

        val key = Pair(warning.type!!, warning.state!!)

        if (hasPlayedWarning.getOrDefault(key, false)) return

        hasPlayedWarning[key] = true

        NotificationHelper.showWarningNotification(
            this,
            getString(R.string.notification_warning_title),
            warning.text!!,
            getIncidentIcon(warning.type.toIntOrNull())
        )
        ttsManager.speak(warning.tts!!)
    }

    private fun startLocationUpdates() {
        val hasFineLocationPermission = ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        if (!hasFineLocationPermission) {
            stopSelf()
            return
        }

        fusedLocationClient.requestLocationUpdates(
            locationRequest,
            locationCallback,
            Looper.getMainLooper()
        )
    }

    private val locationCallback = object : LocationCallback() {
        override fun onLocationResult(result: LocationResult) {
            val location = result.lastLocation ?: return

            Constants.VALID_WARNING_TYPES.forEach { eventType ->
                socketIOClient.sendLocation(
                    eventType,
                    location.longitude,
                    location.latitude,
                    location.bearing.toDouble(),
                    location.speed.toDouble()
                )
            }
        }
    }

    private fun initTTS() {
        ttsManager = TTSManager(this)
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        fusedLocationClient.removeLocationUpdates(locationCallback)
        socketIOClient.disconnect()
        ttsManager.shutdown()
        stopForeground(STOP_FOREGROUND_REMOVE)
    }
}
