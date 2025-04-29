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
    voiceInstruction: VoiceInstruction | null;
    bannerInstruction: BannerInstruction;
    nextBannerInstruction: BannerInstruction | null;
    laneInformation: Lane[];
    shieldInformation: RoadShield;
    distanceToNextStep: number;
}

export interface CurrentAnnotation {
    remainingDistance: string;
    remainingDuration: string;
    remainingTime: number;
}

export interface RoadShield {
    icon: ShieldComponent[] | null;
    text: string | null;
}

export interface ShieldComponent {
    type: ShieldComponentType | null;
    name?: RoadShieldName | null;
    display_ref?: string | null;
    text_color?: string | null;
    text: string | null;
}

export enum ShieldComponentType {
    ICON = "icon",
    EXIT_NUMBER = "exit-number",
    TEXT = "text",
}

export interface RoadShieldIcon {
    name: RoadShieldName | null;
    display_ref: string | null;
    text_color: string | null;
}

export interface Lane {
    active: boolean;
    active_direction: LaneDirection | null;
    directions: LaneDirection[];
}

export enum RoadShieldName {
    DE_MOTORWAY = "de-motorway",
    MOTORWAY_EXIT = "motorwayExit",
    RECTANGLE_YELLOW = "rectangle-yellow",
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
    mapbox_shield: RoadShieldIcon;
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
}

export interface ManeuverImage {
    currentArrowDir: ImageSourcePropType;
    nextArrowDir: ImageSourcePropType | null;
}

export type LaneImage = (ImageSourcePropType | undefined)[];

export enum ExcludeType {
    TOLL = "toll",
    MOTORWAY = "motorway",
    FERRY = "ferry",
    UNPAVED = "unpaved",
    CASH_ONLY_TOLLS = "cash_only_tolls",
}

export type ExcludeTypes = {
    [key in ExcludeType]: boolean;
};

export interface SnapToRouteConfig {
    snapRadius: number;
    minAccuracy: number;
    maxSnapHeadingDifference: number;
}
