import { Instruction, ManeuverType, MapboxStyle } from "../types/IMap";

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

export function arrowDirection(step: Instruction) {
    switch (step.driving_side) {
        case ManeuverType.CONTINUE:
        case ManeuverType.STRAIGHT:
            return "up";
        case ManeuverType.LEFT:
            return "left";
        case ManeuverType.RIGHT:
            return "right";
        default:
            return undefined;
    }
}

export function isValidLonLat(lon: number, lat: number) {
    return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
}

export function haversineDistance(start: { lon: number, lat: number; }, end: { lon: number, lat: number; }) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (end.lat - start.lat) * (Math.PI / 180);
    const dLon = (end.lon - start.lon) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(start.lat * (Math.PI / 180)) * Math.cos(end.lat * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Convert to meters
};