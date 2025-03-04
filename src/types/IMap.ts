import { CameraPadding } from "@rnmapbox/maps";
import { Geometry } from "@turf/helpers";

export interface LonLat {
    lon: number | undefined;
    lat: number | undefined;
}

export interface Position {
    lon: number;
    lat: number;
}

export interface BoundingBox {
    minLat: number;
    minLon: number;
    maxLat: number;
    maxLon: number;
}

export interface MapConfig {
    position: LonLat;
    animationDuration: number;
    boundsOffset: number;
    noLocationZoom: number;
    zoom: number;
    pitch: number;
    followPitch: number;
    padding: CameraPadding;
    followPadding: CameraPadding;
    style: MapboxStyle;
}

export enum MapboxStyle {
    NAVIGATION_DARK = "mapbox://styles/fuggel-dev/clzzy4fvv005s01qs235m7rhi",
    NAVIGATION_LIGHT = "mapbox://styles/fuggel-dev/cm4rcwlis00ca01qv6vkze62x",
    SATELLITE_STREETS = "mapbox://styles/mapbox/satellite-streets-v11",
}

export interface Location {
    properties: {
        address: string;
        full_address: string;
        name: string;
        place_formatted: string;
    };
    geometry: Geometry;
}

export interface WarningAlert {
    textToSpeech?: string;
    title?: string;
    subTitle?: string;
}

export enum LayerId {
    USER_LOCATION = "user-location-layer",
    GPS_ACCURACY = "gps-accuracy-layer",
    STREET_NAME = "road-label-navigation",
    ROUTE = "route-layer",
    ROUTE_DESTINATION = "route-destination-layer",
    CATEGORY_LOCATION = "category-location-layer",
    GAS_STATION = "gas-station-layer",
    SPEED_CAMERA = "speed-camera-layer",
    INCIDENT_SYMBOL = "incident-symbol-layer",
    INVISIBLE = "invisible-layer",
}
