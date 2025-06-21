//
//  Warning.swift
//  Uway
//
//  Created by Furkan Ceylan on 19.06.25.
//

import Foundation

struct Warning {
    let type: String?
    let state: String?
    let text: String?
    let tts: String?
}

struct WarningLogic {
    static let validTypes = ["incident", "speed-camera"]
    static let validStates = ["early", "late"]

    static func isValid(_ warning: Warning) -> Bool {
        guard let type = warning.type,
              let state = warning.state,
              let text = warning.text,
              let tts = warning.tts else { return false }

        return validTypes.contains(type) && validStates.contains(state)
    }
}
