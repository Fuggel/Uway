export interface Instruction {
    distance: number;
    bannerInstructions: any[];
    maneuver: {
        type: ManeuverType;
        instruction: string;
        location: number[];
        modifier: ModifierType;
    };
}

export interface BannerInstruction {
    distanceAlongGeometry: number;
    primary: BannerProperties;
    secondary: BannerProperties;
    sub: BannerProperties;
}

export interface BannerProperties {
    text: string;
    type: ManeuverType;
    modifier: ModifierType;
    degrees: number;
    driving_side: "left" | "right";
    components: BannerComponent[];
}

export interface BannerComponent {
    text: string;
    abbr: string;
    abbr_priority: number;
    imageBaseURL: string;
    directions: ["left", "right", "straight"];
    active: boolean;
    active_direction: string;
}

export enum ManeuverType {
    TURN = "turn",
    DEPART = "depart",
    ARRIVE = "arrive",
    MERGE = "merge",
    OFF_RAMP = "off ramp",
    FORK = "fork",
    ROUNDABOUT = "roundabout",
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
