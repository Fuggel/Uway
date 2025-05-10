package com.fuggel.Uway.services

import android.app.*
import android.content.*
import android.os.*
import android.speech.tts.TextToSpeech
import android.util.Log
import androidx.core.app.NotificationCompat
import com.fuggel.Uway.R
import java.util.*

class ForegroundService : Service() {
    private lateinit var tts: TextToSpeech
    private var ttsReady: Boolean = false
    private var pendingMessage: String? = null
    private var latestMessage: String = "In 300 Metern links abbiegen."

    private val handler = Handler(Looper.getMainLooper())
    private val repeatTask = object : Runnable {
        override fun run() {
            speak(latestMessage)
            handler.postDelayed(this, 5000)
        }
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()

        tts = TextToSpeech(this) { status ->
            if (status == TextToSpeech.SUCCESS) {
                tts.language = Locale.GERMAN
                ttsReady = true
                Log.e("TEST12345", "🚨 TTS-Service wurde gestartet!")
                pendingMessage?.let {
                    speak(it)
                    pendingMessage = null
                }
            } else {
                Log.e("TEST12345", "TTS initialization failed")
            }
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val message = intent?.getStringExtra("message")
        val title = intent?.getStringExtra("title") ?: "Uway"

        message?.let {
            Log.d("TEST12345", "onStartCommand: Neue Nachricht erhalten: $it")
            latestMessage = it
        }

        showNotification(title, latestMessage)

        if (!hasStartedSpeaking) {
            handler.postDelayed(repeatTask, 5000)
            hasStartedSpeaking = true
        }

        return START_STICKY
    }

    private fun speak(text: String) {
        if (ttsReady) {
            Log.d("TEST12345", "Speaking: $text")
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "ttsId")
        } else {
            Log.d("TEST12345", "TTS not ready yet, storing message.")
            pendingMessage = text
        }
    }

    private fun showNotification(title: String, text: String) {
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(text)
            .setSmallIcon(R.drawable.ic_notification)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        startForeground(1, notification)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Uway Notifications",
                NotificationManager.IMPORTANCE_HIGH
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }

    override fun onDestroy() {
        handler.removeCallbacks(repeatTask)
        if (::tts.isInitialized) {
            tts.stop()
            tts.shutdown()
        }
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    companion object {
        const val CHANNEL_ID = "uway_tts_channel"
        private var hasStartedSpeaking = false
    }
}
