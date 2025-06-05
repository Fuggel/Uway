package com.fuggel.Uway.model

data class Instruction(
    val maneuverLocation: List<Double>,
    val voiceInstructions: List<VoiceInstruction>,
)

data class VoiceInstruction(
    val distanceAlongGeometry: Double,
    val announcement: String,
    val ssmlAnnouncement: String,
    val type: String
)

