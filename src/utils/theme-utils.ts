import { MapboxStyle } from "@/types/IMap";

export function determineTheme(theme: MapboxStyle): "light" | "dark" {
    switch (theme) {
        case MapboxStyle.NAVIGATION_DARK:
            return "dark";
        case MapboxStyle.STREETS:
            return "light";
        case MapboxStyle.DARK:
            return "dark";
        case MapboxStyle.LIGHT:
            return "light";
        case MapboxStyle.OUTDOORS:
            return "light";
        case MapboxStyle.SATELLITE:
            return "dark";
        case MapboxStyle.SATELLITE_STREETS:
            return "dark";
        case MapboxStyle.TRAFFIC_DAY:
            return "light";
        case MapboxStyle.TRAFFIC_NIGHT:
            return "dark";
        default:
            return "dark";
    }
}
