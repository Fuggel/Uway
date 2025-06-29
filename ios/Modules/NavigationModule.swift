//
//  NavigationModule.swift
//  Uway
//
//  Created by Furkan Ceylan on 27.06.25.
//

import Foundation
import AVFoundation
import UserNotifications
import CoreLocation

@objc(NavigationModule)
class NavigationModule: NSObject, CLLocationManagerDelegate {
    
    private let speechSynthesizer = AVSpeechSynthesizer()
    private var authToken: String = ""
  
    private var locationManager: CLLocationManager?
    private var instructionsManager: InstructionsManager?
    private var warningManager: WarningManager?

    private var lastInstruction: String?
  
    private var allowTextToSpeech: Bool = true
    private var selectedRouteIndex: Int = 0
    private var showIncidents: Bool = true
    private var playIncidentWarning: Bool = true
    private var showSpeedCameras: Bool = true
    private var playSpeedCameraWarning: Bool = true
    private var isNavigationActive: Bool = true
    private var lastParams: NSDictionary?
    
    @objc func startNavigationService(_ params: NSDictionary) {
        print("navigation: startNavigationService called")

        guard let authToken = params["authToken"] as? String,
              let envConfig = params["envConfig"] as? NSDictionary else {
            return
        }

        self.authToken = authToken
        self.allowTextToSpeech = params["allowTextToSpeech"] as? Bool ?? true
        self.selectedRouteIndex = params["selectedRoute"] as? Int ?? 0
        self.isNavigationActive = params["isNavigationEnabled"] as? Bool ?? true
        self.lastParams = params
      
        if let incidentOptions = params["incidentOptions"] as? NSDictionary {
            self.showIncidents = incidentOptions["showIncidents"] as? Bool ?? true
            self.playIncidentWarning = incidentOptions["playAcousticWarning"] as? Bool ?? true
        }

        if let speedCameraOptions = params["speedCameraOptions"] as? NSDictionary {
            self.showSpeedCameras = speedCameraOptions["showSpeedCameras"] as? Bool ?? false
            self.playSpeedCameraWarning = speedCameraOptions["playAcousticWarning"] as? Bool ?? false
        }

        configureAppConfig(with: envConfig)
        configureAudioSession()
      
        self.warningManager = WarningManager(
               allowTextToSpeech: self.allowTextToSpeech,
               showIncidents: self.showIncidents,
               playIncidentWarning: self.playIncidentWarning,
               showSpeedCameras: self.showSpeedCameras,
               playSpeedCameraWarning: self.playSpeedCameraWarning,
               speak: { self.speak($0) },
               notify: { title, body in
                   NotificationHelper.showNotification(title: title, body: body)
               }
         )

         UwaySocketManager.shared.connect(
             authToken: authToken,
             url: AppConfig.uwayWsUrl,
             onWarning: { [weak self] data in
                 self?.warningManager?.handle(warning: data)
             }
         )

        self.startLocationTracking()
      
        if isNavigationActive {
            self.fetchDirections(params: params)
        }
    }

    @objc func stopNavigationService() {
        print("navigation: stopNavigationService called")

        speechSynthesizer.stopSpeaking(at: .immediate)
        instructionsManager = nil
        lastInstruction = nil

        locationManager?.stopUpdatingLocation()
        locationManager?.delegate = nil
        locationManager = nil
        UwaySocketManager.shared.disconnect()
        warningManager?.reset()
    }

    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }

    private func configureAppConfig(with dict: NSDictionary) {
        if let apiUrl = dict["uwayApiUrl"] as? String {
            AppConfig.uwayApiUrl = apiUrl
        }
        if let wsUrl = dict["uwayWsUrl"] as? String {
            AppConfig.uwayWsUrl = wsUrl
        }
        if let gps = dict["gpsWarningThreshold"] as? Int {
            AppConfig.gpsWarningThreshold = gps
        }
        if let dist = dict["distanceThresholdInMeters"] as? Int {
            AppConfig.distanceThresholdInMeters = dist
        }
        if let speech = dict["speechCooldownInSeconds"] as? Int {
            AppConfig.speechCooldownInMs = speech * 1000
        }
        if let deviation = dict["routeDeviationThresholdInMeters"] as? Int {
            AppConfig.routeDeviationThresholdInMeters = deviation
        }
        if let uMin = dict["uTurnAngleMin"] as? Int {
            AppConfig.uTurnAngleMin = uMin
        }
        if let uMax = dict["uTurnAngleMax"] as? Int {
            AppConfig.uTurnAngleMax = uMax
        }
    }

    private func configureAudioSession() {
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [])
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("navigation: failed to configure audio session: \(error.localizedDescription)")
        }
    }

    private func speak(_ text: String) {
        guard allowTextToSpeech else {
            print("navigation: TTS is disabled, skipping → \(text)")
            return
        }
      
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: "de-DE")
        utterance.rate = AVSpeechUtteranceDefaultSpeechRate
        speechSynthesizer.speak(utterance)
    }
  
    private func startLocationTracking() {
        locationManager = CLLocationManager()
        locationManager?.delegate = self
        locationManager?.desiredAccuracy = kCLLocationAccuracyBest
        locationManager?.requestAlwaysAuthorization()
        locationManager?.startUpdatingLocation()
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }

        instructionsManager?.updateLocation(location)
    }
}

extension NavigationModule {

    private func fetchDirections(params: NSDictionary) {
        guard let profile = params["profileType"] as? String,
              let destinationCoordinates = params["destinationCoordinates"] as? String,
              let startLocation = locationManager?.location else {
            print("navigation: missing or invalid route parameters")
            return
        }

      DirectionsService.fetch(
              authToken: authToken,
              start: startLocation.coordinate,
              destination: destinationCoordinates,
              profile: profile,
              exclude: params["exclude"] as? String,
              selectedRouteIndex: selectedRouteIndex
          ) { instructions in
              guard let steps = instructions else {
                  print("navigation: failed to get valid instructions")
                  return
              }

              DispatchQueue.main.async {
                  self.startInstructionsManager(with: steps)
              }
          }
    }

    private func startInstructionsManager(with steps: [Instruction]) {
        DispatchQueue.main.async {
            self.instructionsManager = InstructionsManager(
                steps: steps,
                speak: { self.speak($0) },
                getLastInstruction: { self.lastInstruction },
                setLastInstruction: { self.lastInstruction = $0 },
                onArrived: {
                    self.stopNavigationService()
                },
                onDeviated: {
                  self.selectedRouteIndex = 0
                  
                   if let currentParams = self.lastParams {
                       self.fetchDirections(params: currentParams)
                   }
                }
            )
            
            if let currentLocation = self.locationManager?.location {
                self.instructionsManager?.updateLocation(currentLocation)
            }
        }
    }
}
