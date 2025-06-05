package com.fuggel.Uway.utils

import com.fuggel.Uway.R

fun getIncidentIcon(eventWarningType: Int?): Int {
    return when (eventWarningType) {
        1 -> R.drawable.incident_accident
        4 -> R.drawable.incident_rain
        5 -> R.drawable.incident_ice
        6 -> R.drawable.incident_jam
        9 -> R.drawable.incident_road_works
        14 -> R.drawable.incident_broken_down_vehicle
        else -> R.drawable.incident_caution
    }
}