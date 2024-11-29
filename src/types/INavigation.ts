export interface Instruction {
    driving_side: string;
    distance: number;
    maneuver: {
        type: ManeuverType;
        instruction: string;
        location: number[];
        modifier: ModifierType;
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

export enum ModifierType {
    U_TURN = "uturn",
    SHARP_RIGHT = "sharp right",
    RIGHT = "right",
    SLIGHT_RIGHT = "slight right",
    STRAIGHT = "straight",
    SLIGHT_LEFT = "slight left",
    LEFT = "left",
    SHARP_LEFT = "sharp left",
}

export interface InstructionWarningThreshold {
    [InstructionThreshold.EARLY]: number;
    [InstructionThreshold.LATE]: number;
}

export interface SpokenInstructions {
    [InstructionThreshold.CURRENT]: boolean;
    [InstructionThreshold.EARLY]: boolean;
    [InstructionThreshold.LATE]: boolean;
}

export enum InstructionThreshold {
    CURRENT = "current",
    EARLY = "early",
    LATE = "late",
}
