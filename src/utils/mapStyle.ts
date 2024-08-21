import { MapboxStyle, MapStyle } from "../types/IMap";

export function determineMapStyle(styleUrl: MapStyle): MapboxStyle {
    switch (styleUrl) {
        case MapStyle.NAVIGATION_DARK:
            return MapboxStyle.NAVIGATION_DARK;
        case MapStyle.DARK:
            return MapboxStyle.DARK;
        case MapStyle.LIGHT:
            return MapboxStyle.LIGHT;
        case MapStyle.OUTDOORS:
            return MapboxStyle.OUTDOORS;
        case MapStyle.SATELLITE:
            return MapboxStyle.SATELLITE;
        case MapStyle.SATELLITE_STREET:
            return MapboxStyle.SATELLITE_STREET;
        case MapStyle.TRAFFIC_DAY:
            return MapboxStyle.TRAFFIC_DAY;
        case MapStyle.TRAFFIC_NIGHT:
            return MapboxStyle.TRAFFIC_NIGHT;
        default:
            return MapboxStyle.NAVIGATION_DARK;
    }
}