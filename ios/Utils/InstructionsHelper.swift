//
//  InstructionsHelper.swift
//  Uway
//
//  Created by Furkan Ceylan on 20.06.25.
//

import Foundation

struct InstructionHelper {
    static func parse(routeJson: [String: Any]) -> [Instruction] {
        var instructions: [Instruction] = []

        guard let legs = routeJson["legs"] as? [[String: Any]] else { return [] }

        for leg in legs {
            guard let steps = leg["steps"] as? [[String: Any]] else { continue }

            for step in steps {
                guard let maneuver = step["maneuver"] as? [String: Any],
                      let loc = maneuver["location"] as? [Double],
                      loc.count == 2 else { continue }

                let maneuverLocation = loc
                let maneuverTypeStr = maneuver["type"] as? String ?? ""
                let maneuverType = ManeuverType.fromValue(maneuverTypeStr)

                var voiceInstructions: [VoiceInstruction] = []
                if let viArray = step["voiceInstructions"] as? [[String: Any]] {
                    voiceInstructions = viArray.compactMap { vi in
                        guard let announcement = vi["announcement"] as? String,
                              let ssml = vi["ssmlAnnouncement"] as? String,
                              let dist = vi["distanceAlongGeometry"] as? Double else { return nil }

                        return VoiceInstruction(
                            distanceAlongGeometry: dist,
                            announcement: announcement,
                            ssmlAnnouncement: ssml,
                            type: "ssml"
                        )
                    }
                }

                instructions.append(
                    Instruction(
                        maneuverLocation: maneuverLocation,
                        maneuverType: maneuverType,
                        voiceInstructions: voiceInstructions
                    )
                )
            }
        }

        return instructions
    }
}
