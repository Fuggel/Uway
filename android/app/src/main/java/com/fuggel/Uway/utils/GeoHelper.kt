package com.fuggel.Uway.utils

import kotlin.math.*

object GeoHelper {

    data class NearestResult(
        val nearestPoint: List<Double>,
        val indexOnLine: Int,
        val distanceMeters: Double
    )

    fun nearestPointOnLine(
        line: List<List<Double>>,
        point: DoubleArray
    ): NearestResult {
        var minDistance = Double.MAX_VALUE
        var closestPoint = doubleArrayOf(0.0, 0.0)
        var closestIndex = 0

        for (i in 0 until line.size - 1) {
            val segStart = line[i]
            val segEnd = line[i + 1]

            val projected = projectPointOnSegment(segStart, segEnd, point)
            val distance = haversine(point[1], point[0], projected[1], projected[0])

            if (distance < minDistance) {
                minDistance = distance
                closestPoint = projected
                closestIndex = i
            }
        }

        return NearestResult(closestPoint.toList(), closestIndex, minDistance)
    }

    fun bearing(from: DoubleArray, to: DoubleArray): Double {
        val lon1 = Math.toRadians(from[0])
        val lat1 = Math.toRadians(from[1])
        val lon2 = Math.toRadians(to[0])
        val lat2 = Math.toRadians(to[1])

        val dLon = lon2 - lon1
        val y = sin(dLon) * cos(lat2)
        val x = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(dLon)

        return (Math.toDegrees(atan2(y, x)) + 360) % 360
    }

    private fun projectPointOnSegment(
        start: List<Double>,
        end: List<Double>,
        point: DoubleArray
    ): DoubleArray {
        val x1 = start[0]
        val y1 = start[1]
        val x2 = end[0]
        val y2 = end[1]
        val px = point[0]
        val py = point[1]

        val dx = x2 - x1
        val dy = y2 - y1
        if (dx == 0.0 && dy == 0.0) return doubleArrayOf(x1, y1)

        val t = max(0.0, min(1.0, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)))
        return doubleArrayOf(x1 + t * dx, y1 + t * dy)
    }

    fun haversine(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
        val radius = 6371000.0
        val dLat = Math.toRadians(lat2 - lat1)
        val dLon = Math.toRadians(lon2 - lon1)
        val a = sin(dLat / 2).pow(2.0) +
                cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) *
                sin(dLon / 2).pow(2.0)
        val c = 2 * atan2(sqrt(a), sqrt(1 - a))
        return radius * c
    }
}
