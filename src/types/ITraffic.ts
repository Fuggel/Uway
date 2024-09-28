export interface IncidentFc {
    type: string;
    incidents: IncidentFeature[];
}

export interface IncidentFeature {
    type: string;
    geometry: {
        type: string;
        coordinates: number[][];
    };
    properties: {
        id: string;
        iconCategory: IncidentType;
        magnitudeOfDelay: number;
        startTimestamp: string;
        endTimestamp: string;
        from: string;
        to: string;
        length: number;
        delay: number;
        roadNumbers: string[];
        timeValidity: string;
        events: IncidentEvent[];
        probabilityOfOccurrence: string;
        geometry: {
            type: string;
            coordinates: number[][];
        };
    };
}

export interface IncidentAlert {
    distance: number;
    events: IncidentEvent[];
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
