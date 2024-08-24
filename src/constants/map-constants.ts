import { MapboxStyle, MapConfig, DropdownItem, RouteProfile, RouteProfileType } from "../types/IMap";

const MAP_STYLES_URL = "../assets/images/map-styles";

export const MAP_CONFIG: MapConfig = {
    position: {
        lon: 9.932443474070425,
        lat: 53.54839604442992,
    },
    zoom: 18,
    pitch: 0,
    followZoom: 20,
    followPitch: 50,
    style: MapboxStyle.NAVIGATION_DARK,
    accessToken: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "",
};

export const MAP_STYLES: DropdownItem[] = [
    {
        label: "Navigation Dark",
        value: MapboxStyle.NAVIGATION_DARK,
        img: require(`${MAP_STYLES_URL}/navigation-dark.png`)
    },
    {
        label: "Streets",
        value: MapboxStyle.STREETS,
        img: require(`${MAP_STYLES_URL}/streets.png`)
    },
    {
        label: "Outdoors",
        value: MapboxStyle.OUTDOORS,
        img: require(`${MAP_STYLES_URL}/outdoors.png`)
    },
    {
        label: "Light",
        value: MapboxStyle.LIGHT,
        img: require(`${MAP_STYLES_URL}/light.png`)
    },
    {
        label: "Dark",
        value: MapboxStyle.DARK,
        img: require(`${MAP_STYLES_URL}/dark.png`)
    },
    {
        label: "Satellite",
        value: MapboxStyle.SATELLITE,
        img: require(`${MAP_STYLES_URL}/satellite.png`)
    },
    {
        label: "Satellite Streets",
        value: MapboxStyle.SATELLITE_STREETS,
        img: require(`${MAP_STYLES_URL}/satellite-streets.png`)
    },
    {
        label: "Traffic Day",
        value: MapboxStyle.TRAFFIC_DAY,
        img: require(`${MAP_STYLES_URL}/traffic-day.png`)
    },
    {
        label: "Traffic Night",
        value: MapboxStyle.TRAFFIC_NIGHT,
        img: require(`${MAP_STYLES_URL}/traffic-night.png`)
    },
];

export const ROUTE_PROFILES: RouteProfile[] = [
    {
        value: RouteProfileType.DRIVING,
        icon: "car"
    },
    {
        value: RouteProfileType.WALKING,
        icon: "walk"
    },
    {
        value: RouteProfileType.CYCLING,
        icon: "bike"
    },
];