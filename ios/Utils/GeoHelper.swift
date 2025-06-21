//
//  GeoHelper.swift
//  Uway
//
//  Created by Furkan Ceylan on 20.06.25.
//

import Foundation
import CoreLocation

struct GeoHelper {
    struct NearestResult {
        let nearestPoint: [Double]
        let indexOnLine: Int
        let distanceMeters: Double
    }

    static func haversine(lat1: Double, lon1: Double, lat2: Double, lon2: Double) -> Double {
        let radius = 6371000.0 // Earth radius in meters
        let dLat = (lat2 - lat1).degreesToRadians
        let dLon = (lon2 - lon1).degreesToRadians

        let a = sin(dLat / 2) * sin(dLat / 2) +
                cos(lat1.degreesToRadians) * cos(lat2.degreesToRadians) *
                sin(dLon / 2) * sin(dLon / 2)

        let c = 2 * atan2(sqrt(a), sqrt(1 - a))
        return radius * c
    }

    static func bearing(from: [Double], to: [Double]) -> Double {
        let lon1 = from[0].degreesToRadians
        let lat1 = from[1].degreesToRadians
        let lon2 = to[0].degreesToRadians
        let lat2 = to[1].degreesToRadians

        let dLon = lon2 - lon1
        let y = sin(dLon) * cos(lat2)
        let x = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(dLon)

        return (atan2(y, x).radiansToDegrees + 360).truncatingRemainder(dividingBy: 360)
    }

    static func nearestPointOnLine(line: [[Double]], point: [Double]) -> NearestResult {
        var minDistance = Double.greatestFiniteMagnitude
        var closestPoint = [0.0, 0.0]
        var closestIndex = 0

        for i in 0..<(line.count - 1) {
            let segStart = line[i]
            let segEnd = line[i + 1]

            let projected = projectPointOnSegment(start: segStart, end: segEnd, point: point)
            let distance = haversine(
                lat1: point[1], lon1: point[0],
                lat2: projected[1], lon2: projected[0]
            )

            if distance < minDistance {
                minDistance = distance
                closestPoint = projected
                closestIndex = i
            }
        }

        return NearestResult(
            nearestPoint: closestPoint,
            indexOnLine: closestIndex,
            distanceMeters: minDistance
        )
    }

    private static func projectPointOnSegment(start: [Double], end: [Double], point: [Double]) -> [Double] {
        let x1 = start[0], y1 = start[1]
        let x2 = end[0], y2 = end[1]
        let px = point[0], py = point[1]

        let dx = x2 - x1
        let dy = y2 - y1
        if dx == 0 && dy == 0 { return [x1, y1] }

        let t = max(0.0, min(1.0, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)))
        return [x1 + t * dx, y1 + t * dy]
    }
}

private extension Double {
    var degreesToRadians: Double { self * .pi / 180 }
    var radiansToDegrees: Double { self * 180 / .pi }
}
