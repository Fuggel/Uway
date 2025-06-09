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
}

export interface IncidentOptions {
    showIncidents: boolean;
    playAcousticWarning: boolean;
}

export interface SpeedCameraOptions {
    showSpeedCameras: boolean;
    playAcousticWarning: boolean;
}
