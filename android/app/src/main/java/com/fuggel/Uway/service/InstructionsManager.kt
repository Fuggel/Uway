package com.fuggel.Uway.service

import android.content.Context
import android.location.Location
import com.fuggel.Uway.model.Instruction
import com.fuggel.Uway.model.ManeuverType
import com.fuggel.Uway.model.VoiceInstruction
import com.fuggel.Uway.utils.GeoHelper
import com.fuggel.Uway.utils.NotificationHelper
import kotlin.math.abs

class InstructionsManager(
    private val steps: List<Instruction>,
    private val ttsManager: TTSManager,
    private val allowTextToSpeech: Boolean,
    private val getLastInstruction: () -> String?,
    private val setLastInstruction: (String) -> Unit,
    private val onArrived: () -> Unit,
    private val onDeviated: () -> Unit,
) {
    private val routeCoordinates: List<List<Double>> = steps.map { it.maneuverLocation }
    private val distanceThreshold = 50.0
    private val deviationThresholdMeters = 30.0
    private val uTurnAngleMin = 150.0
    private val uTurnAngleMax = 210.0

    private var isArrived = false

    fun updateLocation(location: Location, context: Context) {
        if (checkIfArrived(location)) {
            if (!isArrived) {
                isArrived = true
                onArrived()
            }
            return
        }

        if (checkDeviation(location)) {
            onDeviated()
        }

        val currentStep = getClosestStep(location) ?: return
        val distanceToManeuver = GeoHelper.haversine(
            location.latitude, location.longitude,
            currentStep.maneuverLocation[1], currentStep.maneuverLocation[0]
        )

        val activeVoice =
            getActiveVoiceInstruction(currentStep.voiceInstructions, distanceToManeuver)

        if (activeVoice != null && activeVoice.announcement != getLastInstruction()) {
            NotificationHelper.showNotification(context, "Navigation", activeVoice.announcement)

            setLastInstruction(activeVoice.announcement)

            if (allowTextToSpeech) {
                ttsManager.speak(activeVoice.announcement)
            }
        }
    }

    private fun checkDeviation(location: Location): Boolean {
        if (routeCoordinates.size < 2) return false

        val userPoint = doubleArrayOf(location.longitude, location.latitude)
        val (nearestPoint, indexOnLine, distance) = GeoHelper.nearestPointOnLine(
            routeCoordinates,
            userPoint
        )

        if (distance > deviationThresholdMeters) return true

        val nextIndex = (indexOnLine + 1).coerceAtMost(routeCoordinates.size - 1)
        val nextPoint = routeCoordinates[nextIndex]
        val routeBearing =
            GeoHelper.bearing(nearestPoint.toDoubleArray(), nextPoint.toDoubleArray())

        val userBearing = location.bearing.toDouble()
        val angleDiff = abs(routeBearing - userBearing)

        return angleDiff in uTurnAngleMin..uTurnAngleMax
    }

    private fun checkIfArrived(location: Location): Boolean {
        val lastStep = steps.lastOrNull() ?: return false
        if (lastStep.maneuverType != ManeuverType.ARRIVE) return false

        val (lng, lat) = lastStep.maneuverLocation
        val dist = GeoHelper.haversine(location.latitude, location.longitude, lat, lng)
        return dist <= 5.0
    }

    private fun getClosestStep(location: Location): Instruction? {
        val userLat = location.latitude
        val userLng = location.longitude

        return steps.minByOrNull {
            val (lng, lat) = it.maneuverLocation
            GeoHelper.haversine(userLat, userLng, lat, lng)
        }
    }

    private fun getActiveVoiceInstruction(
        voiceInstructions: List<VoiceInstruction>,
        distanceToManeuver: Double
    ): VoiceInstruction? {
        if (voiceInstructions.isEmpty()) return null

        val firstInstruction = voiceInstructions.first()

        return voiceInstructions.firstOrNull { instruction ->
            val diff = abs(distanceToManeuver - instruction.distanceAlongGeometry)
            val isAhead = instruction.distanceAlongGeometry >= distanceToManeuver
            val isFirst = instruction.announcement == firstInstruction.announcement
            isFirst || (isAhead && diff <= distanceThreshold)
        }
    }
}