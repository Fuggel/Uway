package com.fuggel.Uway.utils

import com.fuggel.Uway.model.Instruction
import com.fuggel.Uway.model.ManeuverType
import com.fuggel.Uway.model.VoiceInstruction
import org.json.JSONObject

object InstructionHelper {
    fun parse(routeJson: JSONObject): List<Instruction> {
        val instructions = mutableListOf<Instruction>()

        val legs = routeJson.getJSONArray("legs")
        for (i in 0 until legs.length()) {
            val leg = legs.getJSONObject(i)
            val steps = leg.getJSONArray("steps")

            for (j in 0 until steps.length()) {
                val step = steps.getJSONObject(j)

                val maneuverLocation = step.getJSONObject("maneuver")
                    .getJSONArray("location")
                    .let { arr -> listOf(arr.getDouble(0), arr.getDouble(1)) }

                val voiceInstructions = step.optJSONArray("voiceInstructions")?.let { viArray ->
                    (0 until viArray.length()).map { k ->
                        val viObj = viArray.getJSONObject(k)
                        VoiceInstruction(
                            distanceAlongGeometry = viObj.getDouble("distanceAlongGeometry"),
                            announcement = viObj.getString("announcement"),
                            ssmlAnnouncement = viObj.getString("ssmlAnnouncement"),
                            type = "ssml",
                        )
                    }
                } ?: emptyList()

                val maneuverTypeString = step.getJSONObject("maneuver").optString("type")
                val maneuverType =
                    ManeuverType.fromValue(maneuverTypeString) ?: ManeuverType.CONTINUE

                instructions.add(
                    Instruction(
                        maneuverLocation = maneuverLocation,
                        maneuverType = maneuverType,
                        voiceInstructions = voiceInstructions,
                    )
                )
            }
        }

        return instructions
    }
}
