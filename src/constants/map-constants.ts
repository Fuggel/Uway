import { Dimensions, ImageSourcePropType } from "react-native";

import Mapbox from "@rnmapbox/maps";
import { FeatureCollection, Geometry, GeometryCollection, Position } from "@turf/helpers";

import { MapConfig, MapboxStyle } from "@/types/IMap";
import { MapStyle } from "@/types/ISettings";
import { SpeedCameraProfile, SpeedCameraType } from "@/types/ISpeed";

const deviceHeight = Dimensions.get("window").height;

const MAP_STYLES_URL = "../assets/images/map-styles";
const MAP_ICONS_URL = "../assets/images/map-icons";
const MAP_LANE_DIRECTIONS_URL = "../assets/images/map-icons/directions/lane";

export const DEFAULT_FC: FeatureCollection<Geometry, GeometryCollection> = { type: "FeatureCollection", features: [] };

export const MAP_CONFIG: MapConfig = {
    position: {
        lon: 9.987431941065552,
        lat: 51.14220917694149,
    },
    animationDuration: 1500,
    boundsOffset: 0.25,
    noLocationZoom: 8,
    zoom: 18,
    pitch: 0,
    followPitch: 35,
    padding: {
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
    },
    followPadding: {
        paddingTop: deviceHeight / 2,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
    },
    style: MapboxStyle.NAVIGATION_DARK,
};

export const DEFAULT_CAMERA_SETTINGS = {
    centerCoordinate: [MAP_CONFIG.position.lon, MAP_CONFIG.position.lat] as Position,
    zoomLevel: MAP_CONFIG.noLocationZoom,
    pitch: MAP_CONFIG.pitch,
    heading: undefined,
};

export const MAP_STYLES: MapStyle[] = [
    {
        label: "Dunkel",
        value: MapboxStyle.NAVIGATION_DARK,
        img: require(`${MAP_STYLES_URL}/navigation-dark.png`),
    },
    {
        label: "Hell",
        value: MapboxStyle.NAVIGATION_LIGHT,
        img: require(`${MAP_STYLES_URL}/navigation-light.png`),
    },
    {
        label: "Satellit",
        value: MapboxStyle.SATELLITE_STREETS,
        img: require(`${MAP_STYLES_URL}/satellite-streets.png`),
    },
];

export const MAP_ICONS: { [key: string]: Mapbox.ImageEntry } = {
    "user-location": require(`${MAP_ICONS_URL}/user-location/user-location.png`),
    "route-destination": require(`${MAP_ICONS_URL}/directions/directional/route-destination.png`),
    "speed-camera": require(`${MAP_ICONS_URL}/speed-camera/speed-camera.png`),
    "incident-caution": require(`${MAP_ICONS_URL}/incidents/incident-caution.png`),
    "incident-accident": require(`${MAP_ICONS_URL}/incidents/incident-accident.png`),
    "incident-jam": require(`${MAP_ICONS_URL}/incidents/incident-jam.png`),
    "incident-road-works": require(`${MAP_ICONS_URL}/incidents/incident-road-works.png`),
    "incident-broken-down-vehicle": require(`${MAP_ICONS_URL}/incidents/incident-broken-down-vehicle.png`),
    "incident-road-closure": require(`${MAP_ICONS_URL}/incidents/incident-road-closure.png`),
    "incident-wind": require(`${MAP_ICONS_URL}/incidents/incident-wind.png`),
    "incident-rain": require(`${MAP_ICONS_URL}/incidents/incident-rain.png`),
    "incident-ice": require(`${MAP_ICONS_URL}/incidents/incident-ice.png`),
    "gas-station-expensive": require(`${MAP_ICONS_URL}/gas-station/gas-station-expensive.png`),
    "gas-station-average": require(`${MAP_ICONS_URL}/gas-station/gas-station-average.png`),
    "gas-station-cheap": require(`${MAP_ICONS_URL}/gas-station/gas-station-cheap.png`),
    "search-category": require(`${MAP_ICONS_URL}/categories/search-category.png`),
};

export const LANE_IMAGES: { [key: string]: ImageSourcePropType } = {
    uturn: require(`${MAP_LANE_DIRECTIONS_URL}/uturn.png`),
    "uturn-inactive": require(`${MAP_LANE_DIRECTIONS_URL}/uturn-inactive.png`),
    "turn-right": require(`${MAP_LANE_DIRECTIONS_URL}/turn-right.png`),
    "turn-right-inactive": require(`${MAP_LANE_DIRECTIONS_URL}/turn-right-inactive.png`),
    "turn-left": require(`${MAP_LANE_DIRECTIONS_URL}/turn-left.png`),
    "turn-left-right-right": require(`${MAP_LANE_DIRECTIONS_URL}/turn-left-right-right.png`),
    "turn-left-right-left": require(`${MAP_LANE_DIRECTIONS_URL}/turn-left-right-left.png`),
    "turn-left-right-inactive": require(`${MAP_LANE_DIRECTIONS_URL}/turn-left-right-inactive.png`),
    "turn-left-inactive": require(`${MAP_LANE_DIRECTIONS_URL}/turn-left-inactive.png`),
    straight: require(`${MAP_LANE_DIRECTIONS_URL}/straight.png`),
    "straight-right-straight": require(`${MAP_LANE_DIRECTIONS_URL}/straight-right-straight.png`),
    "straight-right-right": require(`${MAP_LANE_DIRECTIONS_URL}/straight-right-right.png`),
    "straight-right-inactive": require(`${MAP_LANE_DIRECTIONS_URL}/straight-right-inactive.png`),
    "straight-left-straight": require(`${MAP_LANE_DIRECTIONS_URL}/straight-left-straight.png`),
    "straight-left-right-straight": require(`${MAP_LANE_DIRECTIONS_URL}/straight-left-right-straight.png`),
    "straight-left-right-inactive": require(`${MAP_LANE_DIRECTIONS_URL}/straight-left-right-inactive.png`),
    "straight-left-right-right": require(`${MAP_LANE_DIRECTIONS_URL}/straight-left-right-right.png`),
    "straight-left-right-left": require(`${MAP_LANE_DIRECTIONS_URL}/straight-left-right-left.png`),
    "straight-left-left": require(`${MAP_LANE_DIRECTIONS_URL}/straight-left-left.png`),
    "straight-left-inactive": require(`${MAP_LANE_DIRECTIONS_URL}/straight-left-inactive.png`),
    "straight-inactive": require(`${MAP_LANE_DIRECTIONS_URL}/straight-inactive.png`),
    "slight-right": require(`${MAP_LANE_DIRECTIONS_URL}/slight-right.png`),
    "slight-right-inactive": require(`${MAP_LANE_DIRECTIONS_URL}/slight-right-inactive.png`),
    "slight-left": require(`${MAP_LANE_DIRECTIONS_URL}/slight-left.png`),
    "slight-left-inactive": require(`${MAP_LANE_DIRECTIONS_URL}/slight-left-inactive.png`),
    "sharp-right": require(`${MAP_LANE_DIRECTIONS_URL}/sharp-right.png`),
    "sharp-right-inactive": require(`${MAP_LANE_DIRECTIONS_URL}/sharp-right-inactive.png`),
    "sharp-left": require(`${MAP_LANE_DIRECTIONS_URL}/sharp-left.png`),
    "sharp-left-inactive": require(`${MAP_LANE_DIRECTIONS_URL}/sharp-left-inactive.png`),
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
