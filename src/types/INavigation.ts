export interface Instruction {
    driving_side: string;
    distance: number;
    maneuver: {
        type: ManeuverType;
        instruction: string;
        location: number[];
    };
    name: string;
}

export enum ManeuverType {
    LEFT = "left",
    RIGHT = "right",
    STRAIGHT = "straight",
    CONTINUE = "continue",
}

export enum RouteProfileType {
    DRIVING = "driving-traffic",
    WALKING = "walking",
    CYCLING = "cycling",
}

export interface Direction {
    geometry: {
        coordinates: number[][];
    };
    distance: number;
    duration: number;
    legs: any;
}

export interface RouteProfile {
    value: RouteProfileType;
    icon: string;
}

export interface Incident {
    id: string;
    type: IncidentType;
    creation_time: string;
    start_time: string;
    end_time: string;
    description: string;
    long_description: string;
    impact: string;
    sub_type: string;
    south: number;
    west: number;
    north: number;
    east: number;
}

export enum IncidentType {
    ACCIDENT = "accident",
    CONGESTION = "congestion",
    CONSTRUCTION = "construction",
    DISABLED_VEHICLE = "disabled_vehicle",
    ROAD_CLOSURE = "road_closure",
}