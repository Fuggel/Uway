export enum SpeedCameraType {
    STATIONARY = "stationary",
    MOBILE = "mobile",
}

export interface SpeedCameraProperties {
    type: SpeedCameraType;
    address: string;
    direction: string;
    maxspeed: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
}

export interface SpeedCameraProfile {
    value: SpeedCameraType;
    label: string;
}
