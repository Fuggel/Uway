package com.fuggel.Uway.navigation

import android.content.Context
import android.location.Location
import com.fuggel.Uway.model.Instruction
import kotlin.math.abs
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.pow
import kotlin.math.sin
import kotlin.math.sqrt

class InstructionsManager(
    private val steps: List<Instruction>
) {
    private var lastVoiceDistance = -1

    fun updateLocation(location: Location, context: Context) {
        val step = getCurrentStep(location)
        step?.let {
            handleVoiceInstruction(it, location, context)
        }
    }

    private fun getCurrentStep(location: Location): Instruction? {
        val userLat = location.latitude
        val userLng = location.longitude

        var closestStep: Instruction? = null
        var minDistance = Double.MAX_VALUE

        for (step in steps) {
            val (lng, lat) = step.maneuverLocation
            val distance = haversine(userLat, userLng, lat, lng)

            if (distance < minDistance) {
                minDistance = distance
                closestStep = step
            }
        }

        return closestStep
    }

    private fun handleVoiceInstruction(step: Instruction, location: Location, context: Context) {
        val distanceToManeuver = haversine(
            location.latitude, location.longitude,
            step.maneuverLocation[1], step.maneuverLocation[0]
        )

        val activeVoice = step.voiceInstructions.find {
            val diff = abs(distanceToManeuver - it.distanceAlongGeometry)
            diff <= 20
        }

        if (activeVoice != null && activeVoice.distanceAlongGeometry.toInt() != lastVoiceDistance) {
            val message = activeVoice.announcement

            lastVoiceDistance = activeVoice.distanceAlongGeometry.toInt()

//            ForegroundService.updateNotification(context, title = "Navigation", message = message)
        }
    }

    private fun haversine(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
        val radius = 6371000.0 // Radius of the Earth in meters
        val dLat = Math.toRadians(lat2 - lat1)
        val dLon = Math.toRadians(lon2 - lon1)
        val a = sin(dLat / 2).pow(2.0) +
                cos(Math.toRadians(lat1)) *
                cos(Math.toRadians(lat2)) *
                sin(dLon / 2).pow(2.0)
        val c = 2 * atan2(sqrt(a), sqrt(1 - a))
        return radius * c
    }
}
