//
//  Instruction.swift
//  Uway
//
//  Created by Furkan Ceylan on 20.06.25.
//

import Foundation

enum ManeuverType: String {
    case turn
    case depart
    case arrive
    case merge
    case onRamp = "on ramp"
    case offRamp = "off ramp"
    case fork
    case endOfRoad = "end of road"
    case `continue`
    case roundabout

    static func fromValue(_ value: String) -> ManeuverType {
        return ManeuverType(rawValue: value) ?? .continue
    }
}

struct VoiceInstruction {
    let distanceAlongGeometry: Double
    let announcement: String
    let ssmlAnnouncement: String
    let type: String
}

struct Instruction {
    let maneuverLocation: [Double]
    let maneuverType: ManeuverType
    let voiceInstructions: [VoiceInstruction]
}
