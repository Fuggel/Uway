import { ImageSourcePropType } from "react-native";
import { Feature, Geometry, GeometryCollection } from "@turf/helpers";

export interface LonLat {
    lon: number;
    lat: number;
}

export interface MapConfig {
    position: LonLat;
    zoom: number;
    pitch: number;
    followPitch: number;
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

export interface DropdownItem {
    label: string;
    value: string;
    img?: ImageSourcePropType;
}

export interface RouteProfile {
    value: RouteProfileType;
    icon: string;
}

export interface Direction {
    geometry: {
        coordinates: number[][];
    };
    distance: number;
    duration: number;
    legs: any;
}

export interface Suggestion {
    suggestions: {
        full_address: string;
        mapbox_id: string;
    }[];
}

export interface Location {
    properties: {
        address: string;
        full_address: string;
    };
    geometry: Geometry;
}

export interface Instruction {
    driving_side: string;
    distance: number;
    maneuver: {
        type: ManeuverType;
        instruction: string;
        location: number[];
    };
    name: string;
}

export enum ManeuverType {
    LEFT = "left",
    RIGHT = "right",
    STRAIGHT = "straight",
    CONTINUE = "continue",
}

export enum RouteProfileType {
    DRIVING = "driving",
    WALKING = "walking",
    CYCLING = "cycling",
}

export interface OpenStreetMap {
    elements: {
        lat: number;
        lon: number;
        tags: SpeedCameraProperties;
    }[];
}

export interface ParkAvailability {
    lots: {
        address: string;
        coords: {
            lat: number;
            lng: number;
        };
        forecast: boolean;
        free: number;
        id: string;
        lost_type: string;
        name: string;
        region: string;
        state: string;
        total: number;
    }[];
}

export interface SpeedCameraAlert {
    distance: number;
    feature: Feature<Geometry, GeometryCollection>;
}

interface SpeedCameraProperties {
    direction?: string;
    highway?: string;
    man_made?: string;
    mapillary?: string;
    maxspeed?: string;
}

export type SpeedCameraFeature = GeometryCollection & SpeedCameraProperties;