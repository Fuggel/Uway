import { MapboxStyle } from "../types/IMap";

export function determineMapStyle(styleUrl: MapboxStyle): MapboxStyle {
    switch (styleUrl) {
        case MapboxStyle.NAVIGATION_DARK:
            return MapboxStyle.NAVIGATION_DARK;
        case MapboxStyle.STREETS:
            return MapboxStyle.STREETS;
        case MapboxStyle.DARK:
            return MapboxStyle.DARK;
        case MapboxStyle.LIGHT:
            return MapboxStyle.LIGHT;
        case MapboxStyle.OUTDOORS:
            return MapboxStyle.OUTDOORS;
        case MapboxStyle.SATELLITE:
            return MapboxStyle.SATELLITE;
        case MapboxStyle.SATELLITE_STREETS:
            return MapboxStyle.SATELLITE_STREETS;
        case MapboxStyle.TRAFFIC_DAY:
            return MapboxStyle.TRAFFIC_DAY;
        case MapboxStyle.TRAFFIC_NIGHT:
            return MapboxStyle.TRAFFIC_NIGHT;
        default:
            return MapboxStyle.NAVIGATION_DARK;
    }
}

export function isValidLonLat(lon: number, lat: number) {
    return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
}