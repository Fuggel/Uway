package com.fuggel.Uway.service

import android.Manifest
import android.app.Service
import android.content.Intent
import android.content.pm.PackageManager
import android.os.IBinder
import android.os.Looper
import android.util.Log
import androidx.core.content.ContextCompat
import com.fuggel.Uway.R
import com.fuggel.Uway.constants.Constants
import com.fuggel.Uway.model.Warning
import com.fuggel.Uway.model.WarningLogic
import com.fuggel.Uway.utils.InstructionHelper
import com.fuggel.Uway.network.DirectionsClient
import com.fuggel.Uway.socket.SocketIOClient
import com.fuggel.Uway.utils.NotificationHelper
import com.fuggel.Uway.utils.getIncidentIcon
import com.google.android.gms.location.*
import org.json.JSONObject

class NavigationService : Service() {

    private val hasPlayedWarning = mutableMapOf<Triple<String?, String?, String?>, Boolean>()

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationRequest: LocationRequest
    private lateinit var socketIOClient: SocketIOClient
    private lateinit var ttsManager: TTSManager

    private var selectedRoute = 0
    private var destinationCoordinates: String = ""
    private var excludeTypes: String = ""
    private var profileType: String = ""
    private var authToken: String = ""
    private var didFetchDirections = false
    private var lastInstruction: String? = null
    private var instructionsManager: InstructionsManager? = null

    override fun onCreate() {
        super.onCreate()
        NotificationHelper.createNotificationChannel(this)
        ttsManager = TTSManager(this)

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        locationRequest = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 2000L)
            .setMinUpdateIntervalMillis(1500L)
            .build()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        selectedRoute = intent?.getIntExtra("selectedRoute", 0) ?: 0
        destinationCoordinates = intent?.getStringExtra("destinationCoordinates") ?: ""
        excludeTypes = intent?.getStringExtra("excludeTypes") ?: ""
        profileType = intent?.getStringExtra("profileType") ?: ""
        authToken = intent?.getStringExtra("authToken") ?: ""

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

        if (!WarningLogic.isValid(warning)) return

        val key = Triple(warning.type, warning.state, warning.tts)
        if (hasPlayedWarning.getOrDefault(key, false)) return
        hasPlayedWarning[key] = true

        NotificationHelper.showNotification(
            this,
            getString(R.string.notification_warning_title),
            warning.text ?: "",
            getIncidentIcon(warning.type?.toIntOrNull())
        )

        ttsManager.speak(warning.tts ?: "")
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

            if (!didFetchDirections) {
                didFetchDirections = true

                DirectionsClient.fetchDirections(
                    authToken = authToken,
                    startLat = location.latitude,
                    startLon = location.longitude,
                    destinationCoordinates = destinationCoordinates,
                    excludeTypes = excludeTypes,
                    profileType = profileType,
                    onSuccess = { response ->
                        val json = JSONObject(response)
                        val routes = json.getJSONObject("data").getJSONArray("routes")
                        if (routes.length() > 0) {
                            val route = routes.getJSONObject(selectedRoute)
                            instructionsManager = InstructionsManager(
                                InstructionHelper.parse(route),
                                ttsManager,
                                getLastInstruction = { lastInstruction },
                                setLastInstruction = { lastInstruction = it },
                                onArrived = {
                                    stopForeground(STOP_FOREGROUND_REMOVE)
                                    stopSelf()
                                },
                                onDeviated = {
                                    didFetchDirections = false
                                    selectedRoute = 0
                                }
                            )
                        }
                    },
                    onError = { error ->
                        Log.d("NavigationService", "Failed fetching directions: ${error.message}")
                    }
                )
            }

            instructionsManager?.updateLocation(location, this@NavigationService)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        fusedLocationClient.removeLocationUpdates(locationCallback)
        socketIOClient.disconnect()
        ttsManager.shutdown()
        stopForeground(STOP_FOREGROUND_REMOVE)
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        super.onTaskRemoved(rootIntent)
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }
}
