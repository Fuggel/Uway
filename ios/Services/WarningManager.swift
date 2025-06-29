//
//  WarningManager.swift
//  Uway
//
//  Created by Furkan Ceylan on 29.06.25.
//

import Foundation

class WarningManager {
    
    private var playedWarnings = Set<String>()

    var allowTextToSpeech: Bool = true
    var showIncidents: Bool = true
    var playIncidentWarning: Bool = true
    var showSpeedCameras: Bool = true
    var playSpeedCameraWarning: Bool = true

    private let speak: (String) -> Void
    private let notify: (String, String) -> Void

    init(
        allowTextToSpeech: Bool,
        showIncidents: Bool,
        playIncidentWarning: Bool,
        showSpeedCameras: Bool,
        playSpeedCameraWarning: Bool,
        speak: @escaping (String) -> Void,
        notify: @escaping (String, String) -> Void
    ) {
        self.allowTextToSpeech = allowTextToSpeech
        self.showIncidents = showIncidents
        self.playIncidentWarning = playIncidentWarning
        self.showSpeedCameras = showSpeedCameras
        self.playSpeedCameraWarning = playSpeedCameraWarning
        self.speak = speak
        self.notify = notify
    }

    func handle(warning: [String: Any]) {
        guard let type = warning["warningType"] as? String,
              let state = warning["warningState"] as? String,
              let tts = warning["textToSpeech"] as? String,
              let text = warning["text"] as? String else {
            print("warningManager: invalid warning payload → \(warning)")
            return
        }

        let key = [type, state, tts].joined(separator: "|")
        if playedWarnings.contains(key) {
            print("warningManager: skipping duplicate warning → \(key)")
            return
        }

        playedWarnings.insert(key)

        switch type {
        case "incident":
            if showIncidents {
                notify("Warnung", text)
            }
            if playIncidentWarning && allowTextToSpeech {
                speak(tts)
            }

        case "speed-camera":
            if showSpeedCameras {
                notify("Blitzer", text)
            }
            if playSpeedCameraWarning && allowTextToSpeech {
                speak(tts)
            }

        default:
            print("warningManager: unknown warning type → \(type)")
        }
    }

    func reset() {
        playedWarnings.removeAll()
    }
}

