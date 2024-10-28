import { Feature, Geometry, GeometryCollection } from "@turf/helpers";

export interface SpeedCameraAlert {
    distance: number;
}

export enum SpeedCameraType {
    STATIONARY = "stationary",
    MOBILE = "mobile",
}

export interface SpeedCameraProperties {
    type: SpeedCameraType;
    address: string;
    direction: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
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
