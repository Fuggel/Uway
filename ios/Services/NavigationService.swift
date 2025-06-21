//
//  NavigationService.swift
//  Uway
//
//  Created by Furkan Ceylan on 19.06.25.
//

import Foundation
import CoreLocation
import AVFoundation
import UserNotifications

class NavigationService: NSObject, CLLocationManagerDelegate {
    static let shared = NavigationService()
    
    private let locationManager = CLLocationManager()
     private let speechSynthesizer = AVSpeechSynthesizer()
  
    private var socketClient: SocketClient?
    private var ttsQueue: [String] = []
    private var isSpeaking = false
    
    private var destinationCoordinates: String = ""
    private var excludeTypes: String = ""
    private var profileType: String = ""
    private var authToken: String = ""
    private var selectedRoute: Int = 0
    private var didFetchDirections = false
    private var lastInstruction: String? = nil
    private var instructionsManager: InstructionsManager? = nil
    
    func start(params: NSDictionary) {
      destinationCoordinates = params["destinationCoordinates"] as? String ?? ""
         excludeTypes = params["exclude"] as? String ?? ""
         profileType = params["profileType"] as? String ?? ""
         authToken = params["authToken"] as? String ?? ""
         selectedRoute = params["selectedRoute"] as? Int ?? 0
         let isNavigationEnabled = params["isNavigationEnabled"] as? Bool ?? true
         let allowTextToSpeech = params["allowTextToSpeech"] as? Bool ?? true

         if let incidentOptions = params["incidentOptions"] as? NSDictionary {
             let showIncidents = incidentOptions["showIncidents"] as? Bool ?? true
             let playIncidentAcousticWarning = incidentOptions["playAcousticWarning"] as? Bool ?? false
         }

         if let speedCameraOptions = params["speedCameraOptions"] as? NSDictionary {
             let showSpeedCameras = speedCameraOptions["showSpeedCameras"] as? Bool ?? false
             let playSpeedCameraAcousticWarning = speedCameraOptions["playAcousticWarning"] as? Bool ?? false
         }

         if let config = params["envConfig"] as? NSDictionary {
             AppConfig.uwayApiUrl = config["uwayApiUrl"] as? String ?? ""
             AppConfig.uwayWsUrl = config["uwayWsUrl"] as? String ?? ""
             AppConfig.gpsWarningThreshold = config["gpsWarningThreshold"] as? Int ?? 250
             AppConfig.distanceThresholdInMeters = config["distanceThresholdInMeters"] as? Int ?? 50
             AppConfig.speechCooldownInMs = config["speechCooldownInSeconds"] as? Int ?? 30 * 1000
             AppConfig.routeDeviationThresholdInMeters = config["routeDeviationThresholdInMeters"] as? Int ?? 30
             AppConfig.uTurnAngleMin = config["uTurnAngleMin"] as? Int ?? 150
             AppConfig.uTurnAngleMax = config["uTurnAngleMax"] as? Int ?? 210
         }

        
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.allowsBackgroundLocationUpdates = true
        locationManager.pausesLocationUpdatesAutomatically = false
        locationManager.startUpdatingLocation()
        
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { _, _ in }
        
        socketClient = SocketClient(authToken: authToken)

        socketClient?.onMessageReceived = { [weak self] message in
            self?.handleWarningMessage(jsonString: message)
        }
        socketClient?.connect()
    }
    
    func stop() {
        locationManager.stopUpdatingLocation()
        socketClient?.disconnect()
        speechSynthesizer.stopSpeaking(at: .immediate)
        instructionsManager = nil
        lastInstruction = nil
        ttsQueue.removeAll()
        isSpeaking = false
    }
    
    private func handleWarningMessage(jsonString: String) {
        guard let data = jsonString.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let text = json["text"] as? String,
              let tts = json["textToSpeech"] as? String else { return }

        speak(tts)

        NotificationHelper.showNotification(
            title: "Warnung",
            body: text
        )
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }

        ["incident", "speed-camera"].forEach { eventType in
            socketClient?.sendLocation(
                eventType: eventType,
                lon: location.coordinate.longitude,
                lat: location.coordinate.latitude,
                heading: location.course,
                speed: location.speed
            )
        }

        if !didFetchDirections {
            didFetchDirections = true
            DirectionsClient.fetchDirections(
                authToken: authToken,
                startLat: location.coordinate.latitude,
                startLon: location.coordinate.longitude,
                destinationCoordinates: destinationCoordinates,
                excludeTypes: excludeTypes,
                profileType: profileType,
                onSuccess: { [weak self] instructions in
                    self?.instructionsManager = InstructionsManager(
                        steps: instructions,
                        speak: { self?.speak($0) },
                        getLastInstruction: { self?.lastInstruction },
                        setLastInstruction: { self?.lastInstruction = $0 },
                        onArrived: { self?.stop() },
                        onDeviated: {
                            self?.didFetchDirections = false
                            self?.selectedRoute = 0
                        }
                    )
                },
                onError: { error in
                    print("Directions error: \(error.localizedDescription)")
                }
            )
        }

        instructionsManager?.updateLocation(location)
    }

    private func speak(_ message: String) {
        guard !message.isEmpty else { return }

        if isSpeaking {
            ttsQueue.append(message)
            return
        }

        isSpeaking = true
        let utterance = AVSpeechUtterance(string: message)
        utterance.voice = AVSpeechSynthesisVoice(language: "de-DE")
        speechSynthesizer.delegate = self
        speechSynthesizer.speak(utterance)
    }
}

extension NavigationService: AVSpeechSynthesizerDelegate {
    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        isSpeaking = false
        if let next = ttsQueue.first {
            ttsQueue.removeFirst()
            speak(next)
        }
    }
}
