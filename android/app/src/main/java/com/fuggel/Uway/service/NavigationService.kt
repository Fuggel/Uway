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

    private var authToken = ""
    private var isNavigationModeEnabled = false
    private var selectedRoute = 0
    private var destinationCoordinates = ""
    private var excludeTypes = ""
    private var profileType = ""
    private var allowTextToSpeech = true
    private var showIncidents = true
    private var playIncidentAcousticWarning = false
    private var showSpeedCameras = false
    private var playSpeedCameraAcousticWarning = false

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
        authToken = intent?.getStringExtra("authToken") ?: ""
        isNavigationModeEnabled = intent?.getBooleanExtra("isNavigationEnabled", false) ?: false
        selectedRoute = intent?.getIntExtra("selectedRoute", 0) ?: 0
        destinationCoordinates = intent?.getStringExtra("destinationCoordinates") ?: ""
        excludeTypes = intent?.getStringExtra("exclude") ?: ""
        profileType = intent?.getStringExtra("profileType") ?: ""
        allowTextToSpeech = intent?.getBooleanExtra("allowTextToSpeech", true) ?: true
        showIncidents = intent?.getBooleanExtra("showIncidents", true) ?: true
        playIncidentAcousticWarning =
            intent?.getBooleanExtra("playIncidentAcousticWarning", false) ?: false
        showSpeedCameras = intent?.getBooleanExtra("showSpeedCameras", false) ?: false
        playSpeedCameraAcousticWarning =
            intent?.getBooleanExtra("playSpeedCameraAcousticWarning", false) ?: false

        socketIOClient = SocketIOClient(Constants.SOCKET_URL, authToken) { message ->
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
            tts = json.optString("textToSpeech").takeIf { it.isNotEmpty() },
            eventWarningType = json.optString("eventWarningType").takeIf { it.isNotEmpty() }
        )

        if (!WarningLogic.isValid(warning)) return

        val key = Triple(warning.type, warning.state, warning.tts)
        if (hasPlayedWarning.getOrDefault(key, false)) return
        hasPlayedWarning[key] = true

        val shouldShowNotification = when (warning.type) {
            Constants.WARNING_TYPE_INCIDENT -> showIncidents
            Constants.WARNING_TYPE_SPEED_CAMERA -> showSpeedCameras
            else -> false
        }

        if (shouldShowNotification) {
            NotificationHelper.showNotification(
                this,
                getString(R.string.notification_warning_title),
                warning.text ?: "",
                getIncidentIcon(warning.eventWarningType?.toIntOrNull())
            )
        }

        if (!allowTextToSpeech) return

        val shouldPlayAcousticWarning = when (warning.type) {
            Constants.WARNING_TYPE_INCIDENT -> playIncidentAcousticWarning
            Constants.WARNING_TYPE_SPEED_CAMERA -> playSpeedCameraAcousticWarning
            else -> false
        }

        if (shouldPlayAcousticWarning) {
            ttsManager.speak(warning.tts ?: "")
        }
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

            if (isNavigationModeEnabled && !didFetchDirections) {
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
                                allowTextToSpeech,
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

            if (isNavigationModeEnabled) {
                instructionsManager?.updateLocation(location, this@NavigationService)
            }
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
