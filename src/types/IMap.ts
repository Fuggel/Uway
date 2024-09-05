import { Geometry } from "@turf/helpers";

export interface LonLat {
    lon: number;
    lat: number;
}

export interface MapConfig {
    position: LonLat;
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