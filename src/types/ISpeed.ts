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

export interface RelevantFeatureParams {
    userPoint: [number, number];
    featurePoint: [number, number];
    heading: number;
    tolerance: number;
}
