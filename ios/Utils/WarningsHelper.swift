//
//  WarningsHelper.swift
//  Uway
//
//  Created by Furkan Ceylan on 29.06.25.
//

import Foundation

func getIncidentIconName(for type: Int?) -> String {
    switch type {
    case 1:
        return "incident_accident"
    case 4:
        return "incident_rain"
    case 5:
        return "incident_ice"
    case 6:
        return "incident_jam"
    case 9:
        return "incident_road_works"
    case 14:
        return "incident_broken_down_vehicle"
    default:
        return "incident_caution"
    }
}
