package com.fuggel.Uway.socket

import android.util.Log
import com.fuggel.Uway.constants.AppConfig
import com.fuggel.Uway.constants.Constants
import io.socket.client.IO
import io.socket.client.Socket
import org.json.JSONObject
import java.net.URISyntaxException

class SocketIOClient(
    private val authToken: String,
    private val onMessageReceived: (String) -> Unit,
) {
    private val tag = "SocketIOClient"
    private var socket: Socket? = null

    fun connect(onConnected: (() -> Unit)? = null) {
        try {
            val opts = IO.Options().apply {
                auth = mapOf("token" to authToken)
            }

            socket = IO.socket(AppConfig.uwayWsUrl, opts)
        } catch (e: URISyntaxException) {
            Log.e(tag, "Invalid URL: ${AppConfig.uwayWsUrl}", e)
            return
        }

        socket?.apply {
            on(Socket.EVENT_CONNECT) {
                onConnected?.invoke()
            }
            on(Socket.EVENT_DISCONNECT) {
                Log.d(tag, "Disconnected")
            }
            on(Socket.EVENT_CONNECT_ERROR) { args ->
                Log.e(tag, "Connect error: ${args.getOrNull(0)}")
            }
            on(Constants.WARNING_MANAGER) { args ->
                val message = args.getOrNull(0)?.toString() ?: return@on
                Log.d(tag, "Message received: $message")
                onMessageReceived(message)
            }

            connect()
            Log.d(tag, "Socket connected to ${AppConfig.uwayWsUrl}")
        }
    }

    fun sendLocation(
        eventType: String,
        lon: Double,
        lat: Double,
        heading: Double? = null,
        speed: Double? = null
    ) {
        val json = JSONObject().apply {
            put("eventType", eventType)
            put("lon", lon)
            put("lat", lat)
            put("heading", heading ?: JSONObject.NULL)
            put("speed", speed ?: JSONObject.NULL)
            put("eventWarningType", JSONObject.NULL)
        }

        socket?.emit(Constants.USER_LOCATION, json)

        Log.d(tag, "Location sent: $json")
    }

    fun disconnect() {
        socket?.disconnect()
        socket?.off()
        socket = null
        Log.d(tag, "Socket disconnected and cleaned up")
    }
}
