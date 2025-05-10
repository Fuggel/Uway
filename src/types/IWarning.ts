import { SpeedCameraType } from "./ISpeed";
import { IncidentType } from "./ITraffic";

export interface Warning {
    warningType: WarningType;
    warningState: WarningState;
    eventWarningType: EventWarningType | null;
    textToSpeech: string;
    text: string;
}

export enum WarningType {
    INCIDENT = "incident",
    SPEED_CAMERA = "speed-camera",
}

export enum WarningState {
    EARLY = "early",
    LATE = "late",
}

export interface WarningAlert {
    text?: string | null;
    textToSpeech?: string | null;
    eventWarningType?: EventWarningType | null;
}

export enum SocketEvent {
    WARNING_MANAGER = "warning-manager",
    USER_LOCATION = "user-location",
}

export interface WarningThresholdState {
    early: boolean;
    late: boolean;
}

export type EventWarningType = IncidentType | SpeedCameraType;
