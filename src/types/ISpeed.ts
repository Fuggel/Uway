import { Feature, Geometry, GeometryCollection } from "@turf/helpers";

export interface SpeedCameraAlert {
    distance: number;
    feature: Feature<Geometry, GeometryCollection>;
}

export interface SpeedCameraProperties {
    direction: string;
    highway: string;
    man_made: string;
    mapillary: string;
    maxspeed: string;
}

export type SpeedCameraFeature = GeometryCollection & SpeedCameraProperties;

export interface SpeedLimitProperties {
    highway: string;
    lit: string;
    maxspeed: string;
    name: string;
    surface: string;
}

export interface SpeedLimitAlert {
    distance: number;
    feature: Feature<Geometry, GeometryCollection>;
}

export type SpeedLimitFeature = GeometryCollection & SpeedLimitProperties;