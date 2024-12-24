import { MapboxStyle } from "@/types/IMap";

export function determineTheme(theme: MapboxStyle): "light" | "dark" {
    switch (theme) {
        case MapboxStyle.NAVIGATION_DARK:
            return "dark";
        case MapboxStyle.NAVIGATION_LIGHT:
            return "light";
        case MapboxStyle.SATELLITE_STREETS:
            return "dark";
        default:
            return "dark";
    }
}

export function invertTheme(theme: "light" | "dark"): "light" | "dark" {
    return theme === "light" ? "dark" : "light";
}
