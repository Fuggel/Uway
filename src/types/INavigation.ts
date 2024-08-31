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
    DRIVING = "driving",
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
