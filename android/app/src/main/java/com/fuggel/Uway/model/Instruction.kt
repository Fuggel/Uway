package com.fuggel.Uway.model

data class Instruction(
    val maneuverLocation: List<Double>,
    val maneuverType: ManeuverType,
    val voiceInstructions: List<VoiceInstruction>,
)

data class VoiceInstruction(
    val distanceAlongGeometry: Double,
    val announcement: String,
    val ssmlAnnouncement: String,
    val type: String
)


enum class ManeuverType(val value: String) {
    TURN("turn"),
    DEPART("depart"),
    ARRIVE("arrive"),
    MERGE("merge"),
    ON_RAMP("on ramp"),
    OFF_RAMP("off ramp"),
    FORK("fork"),
    END_OF_ROAD("end of road"),
    CONTINUE("continue"),
    ROUNDABOUT("roundabout");

    companion object {
        fun fromValue(value: String): ManeuverType? {
            return entries.find { it.value == value }
        }
    }
}