import { Feature, Geometry, GeometryCollection } from "@turf/helpers";

export interface SpeedCamera {
    elements: {
        lat: number;
        lon: number;
        tags: SpeedCameraProperties;
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

export interface SpeedLimit {
    elements: {
        type: string;
        nodes: number[];
        id: number;
        lat: number;
        lon: number;
        tags: SpeedLimitProperties;
    }[];
}

interface SpeedLimitProperties {
    highway: string;
    lit: string;
    maxspeed: string;
    name: string;
    surface: string;
}