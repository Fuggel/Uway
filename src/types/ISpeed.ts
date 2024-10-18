import { Feature, Geometry, GeometryCollection } from "@turf/helpers";

import { WarningAlert } from "./IMap";

export interface SpeedCameraAlert {
    distance: number;
}

export interface SpeedCameraProperties {
    direction: string;
    highway: string;
    man_made: string;
    mapillary: string;
    maxspeed: string;
    height: string;
    colour: string;
    name: string;
    address: string;
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

export interface WarningAlertSpeed extends WarningAlert {
    maxSpeed?: string;
}
