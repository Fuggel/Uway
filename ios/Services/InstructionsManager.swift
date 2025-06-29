//
//  InstructionsManager.swift
//  Uway
//
//  Created by Furkan Ceylan on 19.06.25.
//

import Foundation
import CoreLocation

class InstructionsManager {
    private let steps: [Instruction]
    private let speak: (String) -> Void
    private let getLastInstruction: () -> String?
    private let setLastInstruction: (String) -> Void
    private let onArrived: () -> Void
    private let onDeviated: () -> Void
    
    private var isArrived = false
    private let routeCoordinates: [[Double]]
    
    init(
        steps: [Instruction],
        speak: @escaping (String) -> Void,
        getLastInstruction: @escaping () -> String?,
        setLastInstruction: @escaping (String) -> Void,
        onArrived: @escaping () -> Void,
        onDeviated: @escaping () -> Void
    ) {
        self.steps = steps
        self.speak = speak
        self.getLastInstruction = getLastInstruction
        self.setLastInstruction = setLastInstruction
        self.onArrived = onArrived
        self.onDeviated = onDeviated
        self.routeCoordinates = steps.map { $0.maneuverLocation }
    }
    
    func updateLocation(_ location: CLLocation) {
        guard !checkIfArrived(location: location) else {
            if !isArrived {
                isArrived = true
                print("navigation: destination reached")
                onArrived()
            }
            return
        }

        if checkDeviation(location: location) {
            print("navigation: route deviation detected")
            onDeviated()
        }

        guard let currentStep = getClosestStep(to: location) else {
            print("navigation: no matching step found")
            return
        }

        let distanceToManeuver = GeoHelper.haversine(
            lat1: location.coordinate.latitude,
            lon1: location.coordinate.longitude,
            lat2: currentStep.maneuverLocation[1],
            lon2: currentStep.maneuverLocation[0]
        )

        if let activeVoice = getActiveVoiceInstruction(
            voiceInstructions: currentStep.voiceInstructions,
            distanceToManeuver: distanceToManeuver
        ) {
            if activeVoice.announcement != getLastInstruction() {
                setLastInstruction(activeVoice.announcement)
                speak(activeVoice.announcement)
                NotificationHelper.showNotification(
                    title: "Navigation",
                    body: activeVoice.announcement
                )
            }
        }
    }

    private func checkIfArrived(location: CLLocation) -> Bool {
        guard let lastStep = steps.last,
              lastStep.maneuverType == .arrive else { return false }

        let (lng, lat) = (lastStep.maneuverLocation[0], lastStep.maneuverLocation[1])
        let dist = GeoHelper.haversine(
            lat1: location.coordinate.latitude,
            lon1: location.coordinate.longitude,
            lat2: lat,
            lon2: lng
        )
      
        return dist <= 5.0
    }

    private func checkDeviation(location: CLLocation) -> Bool {
        guard routeCoordinates.count >= 2 else { return false }

        let userPoint = [location.coordinate.longitude, location.coordinate.latitude]
        let result = GeoHelper.nearestPointOnLine(line: routeCoordinates, point: userPoint)

        if result.distanceMeters > Double(AppConfig.routeDeviationThresholdInMeters) {
            return true
        }

        guard location.course >= 0 else {
            return false
        }
      
        let nextIndex = min(result.indexOnLine + 1, routeCoordinates.count - 1)
        let nextPoint = routeCoordinates[nextIndex]
        let routeBearing = GeoHelper.bearing(
            from: result.nearestPoint,
            to: nextPoint
        )
        let userBearing = location.course
        let angleDiff = abs(routeBearing - userBearing)
      
        return angleDiff >= Double(AppConfig.uTurnAngleMin) && angleDiff <= Double(AppConfig.uTurnAngleMax)
    }

    private func getClosestStep(to location: CLLocation) -> Instruction? {
        steps.min(by: { lhs, rhs in
            let lhsDist = GeoHelper.haversine(
                lat1: location.coordinate.latitude,
                lon1: location.coordinate.longitude,
                lat2: lhs.maneuverLocation[1],
                lon2: lhs.maneuverLocation[0]
            )
            let rhsDist = GeoHelper.haversine(
                lat1: location.coordinate.latitude,
                lon1: location.coordinate.longitude,
                lat2: rhs.maneuverLocation[1],
                lon2: rhs.maneuverLocation[0]
            )
            return lhsDist < rhsDist
        })
    }

    private func getActiveVoiceInstruction(
        voiceInstructions: [VoiceInstruction],
        distanceToManeuver: Double
    ) -> VoiceInstruction? {
        guard !voiceInstructions.isEmpty else { return nil }
        let first = voiceInstructions.first!
        return voiceInstructions.first(where: {
            let diff = abs($0.distanceAlongGeometry - distanceToManeuver)
            let isAhead = $0.distanceAlongGeometry >= distanceToManeuver
            let result = $0.announcement == first.announcement || (isAhead && diff <= Double(AppConfig.distanceThresholdInMeters))
          
            return result
        })
    }
}

