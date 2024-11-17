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
    "user-location": require(`${MAP_ICONS_URL}/user-location.png`),
    "speed-camera": require(`${MAP_ICONS_URL}/speed-camera.png`),
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
