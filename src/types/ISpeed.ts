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

export interface SpeedCameraProfile {
    value: SpeedCameraType;
    label: string;
}

export interface AheadFeatureParams {
    userPoint: [number, number];
    featurePoint: [number, number];
    heading: number;
    tolerance: number;
}

export type SpeedLimitFeature = GeometryCollection & SpeedLimitProperties;

export interface SpeedLimitProperties {
    maxspeed: string;
}

export interface SpeedLimitAlert {
    distance: number;
    feature: Feature<Geometry, GeometryCollection>;
}
