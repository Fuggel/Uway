export interface IncidentFeature {
    type: string;
    geometry: {
        type: string;
        coordinates: number[][];
    };
    properties: IncidentProperties;
}

export enum IncidentType {
    Unknown = 0,
    Accident = 1,
    DangerousConditions = 3,
    Rain = 4,
    Ice = 5,
    Jam = 6,
    LaneClosed = 7,
    RoadClosed = 8,
    RoadWorks = 9,
    Wind = 10,
    BrokenDownVehicle = 14,
}

export interface IncidentEvent {
    code: number;
    description: string;
    iconCategory: IncidentType;
}

export interface IncidentProperties {
    id: string;
    iconCategory: IncidentType;
    description: string;
    startTime: string;
    endTime: string;
    from: string;
    to: string;
    length: number;
    delay: number;
    roadNumbers: string[];
    timeValidity: string;
    events: IncidentEvent[];
    probabilityOfOccurrence: string;
    lastReportTime: string;
    firstPoint: number[];
    geometry: {
        type: string;
        coordinates: number[][];
    };
}
