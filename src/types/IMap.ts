import { Geometry } from "@turf/helpers";

export interface LonLat {
    lon: number | undefined;
    lat: number | undefined;
}

export interface BoundingBox {
    minLat: number;
    minLon: number;
    maxLat: number;
    maxLon: number;
}

export interface MapConfig {
    position: LonLat;
    noLocationZoom: number;
    zoom: number;
    pitch: number;
    followPitch: number;
    followZoom: number;
    style: MapboxStyle;
    accessToken: string;
}

export enum MapboxStyle {
    NAVIGATION_DARK = "mapbox://styles/fuggel-dev/clzzy4fvv005s01qs235m7rhi",
    STREETS = "mapbox://styles/mapbox/streets-v11",
    DARK = "mapbox://styles/mapbox/dark-v10",
    LIGHT = "mapbox://styles/mapbox/light-v10",
    OUTDOORS = "mapbox://styles/mapbox/outdoors-v11",
    SATELLITE = "mapbox://styles/mapbox/satellite-v9",
    SATELLITE_STREETS = "mapbox://styles/mapbox/satellite-streets-v11",
    TRAFFIC_DAY = "mapbox://styles/mapbox/navigation-preview-day-v4",
    TRAFFIC_NIGHT = "mapbox://styles/mapbox/navigation-preview-night-v4",
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

export enum FirstLayerId {
    ROUTE = "route-layer",
    PARKING_AVAILABILITY = "parking-availability-layer-0",
    GAS_STATION = "gas-station-layer-0",
    SPEED_CAMERA = "speed-camera-layer-0",
    INCIDENT_LINE = "incident-line-layer-0",
    INCIDENT_SYMBOL = "incident-symbol-layer-0",
    USER_LOCATION = "mapboxUserLocationPulseCircle",
}
