package com.fuggel.Uway.navigation

import com.fuggel.Uway.model.Instruction
import com.fuggel.Uway.model.VoiceInstruction
import org.json.JSONArray

object InstructionParser {

    fun parse(jsonArray: JSONArray): List<Instruction> {
        val instructions = mutableListOf<Instruction>()

        for (i in 0 until jsonArray.length()) {
            val obj = jsonArray.getJSONObject(i)

            val maneuverLocation = obj.getJSONArray("maneuverLocation").let { arr ->
                listOf(arr.getDouble(0), arr.getDouble(1))
            }

            val voiceInstructions = obj.getJSONArray("voiceInstructions").let { viArray ->
                (0 until viArray.length()).map { j ->
                    val viObj = viArray.getJSONObject(j)
                    VoiceInstruction(
                        distanceAlongGeometry = viObj.getDouble("distanceAlongGeometry"),
                        announcement = viObj.getString("announcement"),
                        ssmlAnnouncement = viObj.getString("ssmlAnnouncement"),
                        type = "ssml",
                    )
                }
            }

            instructions.add(
                Instruction(
                    maneuverLocation = maneuverLocation,
                    voiceInstructions = voiceInstructions,
                )
            )
        }

        return instructions
    }
}
