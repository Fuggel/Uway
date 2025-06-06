package com.fuggel.Uway.service

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import java.util.*
import java.util.concurrent.ConcurrentLinkedQueue

class TTSManager(context: Context) {

    private var tts: TextToSpeech? = null
    private val queue: Queue<String> = ConcurrentLinkedQueue()
    private var isSpeaking = false

    init {
        tts = TextToSpeech(context.applicationContext) { status ->
            if (status == TextToSpeech.SUCCESS) {
                tts?.language = Locale.GERMAN

                tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                    override fun onStart(utteranceId: String?) {
                        isSpeaking = true
                    }

                    override fun onDone(utteranceId: String?) {
                        isSpeaking = false
                        playNext()
                    }

                    @Deprecated("Deprecated in Java")
                    override fun onError(utteranceId: String?) {
                        isSpeaking = false
                        playNext()
                    }
                })
            }
        }
    }

    fun speak(message: String) {
        queue.offer(message)
        if (!isSpeaking) {
            playNext()
        }
    }

    private fun playNext() {
        val next = queue.poll() ?: return
        isSpeaking = true
        val utteranceId = UUID.randomUUID().toString()
        tts?.speak(next, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
    }

    fun shutdown() {
        queue.clear()
        tts?.stop()
        tts?.shutdown()
    }
}
