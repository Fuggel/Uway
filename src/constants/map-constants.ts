import Mapbox from "@rnmapbox/maps";
import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";

import { MapConfig, MapboxStyle } from "@/types/IMap";
import { MapStyle } from "@/types/ISettings";
import { SpeedCameraProfile, SpeedCameraType } from "@/types/ISpeed";

const MAP_STYLES_URL = "../assets/images/map-styles";
const MAP_ICONS_URL = "../assets/images/map-icons";
export const DEFAULT_FC: FeatureCollection<Geometry, GeometryCollection> = { type: "FeatureCollection", features: [] };

export const MAP_CONFIG: MapConfig = {
    position: {
        lon: 9.987431941065552,
        lat: 51.14220917694149,
    },
    noLocationZoom: 8,
    zoom: 18,
    pitch: 0,
    followPitch: 50,
    followZoom: 20,
    style: MapboxStyle.DARK,
    accessToken: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "",
};

export const MAP_STYLES: MapStyle[] = [
    {
        label: "Dunkel",
        value: MapboxStyle.DARK,
        img: require(`${MAP_STYLES_URL}/dark.png`),
    },
    {
        label: "Hell",
        value: MapboxStyle.LIGHT,
        img: require(`${MAP_STYLES_URL}/light.png`),
    },
    {
        label: "Navigation",
        value: MapboxStyle.NAVIGATION_DARK,
        img: require(`${MAP_STYLES_URL}/navigation-dark.png`),
    },
    {
        label: "Satellit",
        value: MapboxStyle.SATELLITE_STREETS,
        img: require(`${MAP_STYLES_URL}/satellite-streets.png`),
    },
];

export const MAP_ICONS: { [key: string]: Mapbox.ImageEntry } = {
    "speed-camera": require(`${MAP_ICONS_URL}/speed-camera.png`),
    "parking-availability": require(`${MAP_ICONS_URL}/parking.png`),
    "incident-caution": require(`${MAP_ICONS_URL}/incident-caution.png`),
    "incident-accident": require(`${MAP_ICONS_URL}/incident-accident.png`),
    "incident-jam": require(`${MAP_ICONS_URL}/incident-jam.png`),
    "incident-road-works": require(`${MAP_ICONS_URL}/incident-road-works.png`),
    "incident-broken-down-vehicle": require(`${MAP_ICONS_URL}/incident-broken-down-vehicle.png`),
    "incident-road-closure": require(`${MAP_ICONS_URL}/incident-road-closure.png`),
    "incident-wind": require(`${MAP_ICONS_URL}/incident-wind.png`),
    "incident-rain": require(`${MAP_ICONS_URL}/incident-rain.png`),
    "incident-ice": require(`${MAP_ICONS_URL}/incident-ice.png`),
    "gas-station-expensive": require(`${MAP_ICONS_URL}/gas-station-expensive.png`),
    "gas-station-average": require(`${MAP_ICONS_URL}/gas-station-average.png`),
    "gas-station-cheap": require(`${MAP_ICONS_URL}/gas-station-cheap.png`),
};

export const SPEED_CAMERA_TYPE: SpeedCameraProfile[] = [
    {
        value: SpeedCameraType.STATIONARY,
        label: "Stationär",
    },
    {
        value: SpeedCameraType.MOBILE,
        label: "Mobil",
    },
];

export const ROUTE_DEVIATION_THRESHOLD_IN_METERS = 50;
export const NEXT_STEP_THRESHOLD_IN_METERS = 20;
export const SHOW_SPEED_CAMERA_THRESHOLD_IN_METERS = 10000;
export const SHOW_SPEED_CAMERA_WARNING_THRESHOLD_IN_METERS = 500;
export const PLAY_ACOUSTIC_WARNING_SPEED_CAMERA_THRESHOLD_IN_METERS = 300;
export const SHOW_SPEED_LIMIT_THRESHOLD_IN_METERS = 150;
export const SHOW_GAS_STATIONS_THRESHOLD_IN_KILOMETERS = 4;
export const SHOW_INCIDENTS_THRESHOLD_IN_METERS = 5000;
export const SHOW_INCIDENT_WARNING_THRESHOLD_IN_METERS = 500;
export const PLAY_ACOUSTIC_WARNING_INCIDENT_THRESHOLD_IN_METERS = 300;
export const IS_ON_SAME_LANE_INCIDENTS_THRESHOLD_IN_DEGREES = 20;
export const IS_ON_SAME_LANE_SPEED_CAMERA_THRESHOLD_IN_DEGREES = 10;
