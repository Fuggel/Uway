export interface StartNavigation {
    authToken: string;
    destinationCoordinates: string;
    exclude: string;
    profileType: string;
    selectedRoute: number;
    isNavigationEnabled: boolean;
    allowTextToSpeech: boolean;
    incidentOptions: IncidentOptions;
    speedCameraOptions: SpeedCameraOptions;
    envConfig: EnvConfig;
}

export interface IncidentOptions {
    showIncidents: boolean;
    playAcousticWarning: boolean;
}

export interface SpeedCameraOptions {
    showSpeedCameras: boolean;
    playAcousticWarning: boolean;
}

export interface EnvConfig {
    uwayApiUrl: string;
    uwayWsUrl: string;
    gpsWarningThreshold: number;
    distanceThresholdInMeters: number;
    speechCooldownInSeconds: number;
    routeDeviationThresholdInMeters: number;
    uTurnAngleMin: number;
    uTurnAngleMax: number;
}
