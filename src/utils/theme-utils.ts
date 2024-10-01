import { ViewStyle } from "react-native";
import { MapboxStyle } from "../types/IMap";
import { COLORS } from "../constants/colors-constants";

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

export function dynamicThemeStyles(style: ViewStyle, theme: "light" | "dark"): ViewStyle {
    return {
        ...style,
        borderWidth: theme === "light" ? 2 : undefined,
        borderColor: theme === "light" ? COLORS.gray : undefined,
    };
}
