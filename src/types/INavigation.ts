import { ImageSourcePropType } from "react-native";

import { Geometry } from "@turf/helpers";

export interface Instruction {
    distance: number;
    bannerInstructions: BannerInstruction[];
    voiceInstructions: VoiceInstruction[];
    maneuver: ManeuverInstruction;
    duration: number;
    geometry: Geometry;
}

export interface CurrentInstruction {
    step: Instruction;
    voiceInstruction: VoiceInstruction;
    bannerInstruction: BannerInstruction;
    nextBannerInstruction: BannerInstruction | null;
    laneInformation: Lane[];
    maxSpeed: number | string;
    remainingDistance: string;
    remainingDuration: string;
    remainingTime: number;
    distanceToNextStep: number;
}

export interface Lane {
    active: boolean;
    active_direction: LaneDirection | null;
    directions: LaneDirection[];
}

export enum LaneDirection {
    STRAIGHT = "straight",
    SHARP_LEFT = "sharp left",
    LEFT = "left",
    SLIGHT_LEFT = "slight left",
    SLIGHT_RIGHT = "slight right",
    RIGHT = "right",
    SHARP_RIGHT = "sharp right",
    U_TURN = "uturn",
}

export interface ManeuverInstruction {
    type: ManeuverType;
    instruction: string;
    location: number[];
    modifier: ModifierType;
}

export interface BannerInstruction {
    distanceAlongGeometry: number;
    primary: BannerProperties;
    secondary: BannerProperties;
    sub: BannerProperties;
}

export interface VoiceInstruction {
    distanceAlongGeometry: number;
    announcement: string;
    ssmlAnnouncement: string;
    type: "ssml";
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
    type: string;
    abbr: string;
    abbr_priority: number;
    imageBaseURL: string;
    directions: LaneDirection[];
    active: boolean;
    active_direction: LaneDirection;
}

export enum ManeuverType {
    TURN = "turn",
    DEPART = "depart",
    ARRIVE = "arrive",
    MERGE = "merge",
    ON_RAMP = "on ramp",
    OFF_RAMP = "off ramp",
    FORK = "fork",
    END_OF_ROAD = "end of road",
    CONTINUE = "continue",
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
    steps: Instruction[];
    annotation: Annotation;
}

export interface Annotation {
    distance: number[];
    duration: number[];
    maxspeed: { speed: number; unit: string }[];
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

export interface ManeuverImage {
    currentArrowDir: ImageSourcePropType;
    nextArrowDir: ImageSourcePropType | null;
}

export type LaneImage = (ImageSourcePropType | undefined)[];

export enum RoadShieldType {
    MOTORWAY = "motorway",
    MOTORWAY_EXIT = "motorwayExit",
    FEDERAL_HIGHWAY = "federalHighway",
    EUROPEAN_ROAD = "europeanRoad",
}
