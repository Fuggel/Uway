import { Location } from "@rnmapbox/maps";
import { LineString, lineString, point } from "@turf/helpers";
import { distance, nearestPointOnLine } from "@turf/turf";

import {
    BannerInstruction,
    CurrentAnnotation,
    CurrentInstruction,
    Instruction,
    Lane,
    ManeuverType,
    RoadShield,
    ShieldComponentType,
    VoiceInstruction,
} from "@/types/INavigation";
import { convertSpeedToKmh, removeConsecutiveDuplicates } from "@/utils/map-utils";

class Instructions {
    public userPosition: Location | null;
    public isArrived = false;

    private routeGeometry: number[][] = [];
    private instructions: Instruction[];
    private currentStepIndex = 0;
    private lastDistanceToNextStep = 0;
    private roundedUpdates = 10;
    private distanceThreshold = 50;

    constructor(routeGeometry: number[][], instructions: Instruction[], userPosition: Location | null) {
        this.routeGeometry = routeGeometry;
        this.instructions = instructions;
        this.userPosition = userPosition;
    }

    public getCurrentInstructions(): CurrentInstruction | undefined {
        return this.determineCurrentInstructions();
    }

    public getCurrentAnnotations(): CurrentAnnotation | undefined {
        return this.determineCurrentAnnotation();
    }

    public checkIfArrived(onCancel: () => void) {
        if (!this.userPosition || !this.instructions || this.isArrived) return;

        const lastStep = this.instructions[this.instructions.length - 1];
        if (lastStep.maneuver.type === ManeuverType.ARRIVE && this.userPosition) {
            const targetCoordinates = lastStep.geometry.coordinates.slice(-1)[0] as number[];

            const from = point([this.userPosition.coords.longitude, this.userPosition.coords.latitude]);
            const to = point(targetCoordinates);
            const dist = distance(from, to, { units: "meters" });

            if (dist <= 3) {
                this.isArrived = true;
                onCancel();
            }
        }
    }

    private determineCurrentInstructions(): CurrentInstruction | undefined {
        let closestStep: Instruction = {} as Instruction;
        let minDistance = Infinity;

        this.instructions.forEach((step, stepIndex) => {
            if (!this.userPosition) return;

            const userPoint = point([this.userPosition.coords.longitude, this.userPosition.coords.latitude]);

            const cleanRouteLine = removeConsecutiveDuplicates(step.geometry.coordinates as number[][]);
            const routeLine = lineString(cleanRouteLine);

            const snappedPoint = nearestPointOnLine(routeLine, userPoint);

            if (snappedPoint.properties.dist < minDistance) {
                minDistance = snappedPoint.properties.dist;
                closestStep = step;
                this.currentStepIndex = stepIndex;
            }
        });

        if (closestStep) {
            const { activeBannerInstruction, nextBannerInstruction, activeVoiceInstruction } =
                this.getActiveInstruction(closestStep, minDistance);

            return {
                step: closestStep,
                voiceInstruction: activeVoiceInstruction,
                bannerInstruction: activeBannerInstruction,
                nextBannerInstruction,
                laneInformation: this.extractLaneInformation(activeBannerInstruction),
                shieldInformation: this.extractShieldInformation(activeBannerInstruction),
                distanceToNextStep: this.getCurrentDistanceToStep(),
            };
        }
    }

    public determineCurrentAnnotation() {
        if (!this.userPosition || !this.routeGeometry) return;

        let minDistance = Infinity;
        let closestLeg: number[][] = [];

        const userPoint = point([this.userPosition.coords.longitude, this.userPosition.coords.latitude]);

        for (let i = 0; i < this.routeGeometry.length - 1; i++) {
            const line = {
                type: "LineString",
                coordinates: [this.routeGeometry[i], this.routeGeometry[i + 1]],
            } as LineString;

            const snappedPoint = nearestPointOnLine(line, userPoint);

            if (snappedPoint.properties.dist < minDistance) {
                minDistance = snappedPoint.properties.dist;
                closestLeg = line.coordinates;
            }
        }

        if (closestLeg) {
            const remainingInfo = this.getRemainingInfo();

            return {
                remainingDistance: remainingInfo.remainingDistance,
                remainingDuration: remainingInfo.remainingDuration,
                remainingTime: remainingInfo.remainingTime,
            };
        }
    }

    private getCurrentDistanceToStep() {
        if (!this.userPosition) return 0;

        const nextStep = this.getNextStep();

        const userPoint = point([this.userPosition.coords.longitude, this.userPosition.coords.latitude]);
        const stepPoint = point(nextStep.maneuver.location);

        const distanceToNextStep = distance(userPoint, stepPoint, { units: "meters" });
        const distanceToNextStepRounded = Math.round(distanceToNextStep / this.roundedUpdates) * this.roundedUpdates;

        const currentSpeed = this.userPosition.coords.speed ? convertSpeedToKmh(this.userPosition.coords.speed) : 0;
        const updateThreshold = this.getUpdateThreshold(currentSpeed);

        if (Math.abs(distanceToNextStepRounded - this.lastDistanceToNextStep) >= updateThreshold) {
            this.lastDistanceToNextStep = distanceToNextStepRounded;
            return distanceToNextStepRounded;
        }

        return this.lastDistanceToNextStep;
    }

    private getRemainingInfo() {
        let totalRemainingDistance = 0;
        let totalRemainingTime = 0;

        for (let i = this.currentStepIndex; i < this.instructions.length; i++) {
            totalRemainingDistance += this.instructions[i].distance || 0;
            totalRemainingTime += this.instructions[i].duration || 0;
        }

        const distanceInKm = totalRemainingDistance / 1000;
        const timeInMinutes = totalRemainingTime / 60;

        return {
            remainingDistance: distanceInKm.toFixed(1),
            remainingDuration: timeInMinutes.toFixed(0),
            remainingTime: totalRemainingTime,
        };
    }

    private getActiveInstruction(closestStep: Instruction, minDistance: number) {
        const nextStep = this.getNextStep();

        return {
            activeBannerInstruction:
                closestStep.bannerInstructions.find(
                    (instruction) => instruction.distanceAlongGeometry >= minDistance
                ) || closestStep.bannerInstructions[0],
            nextBannerInstruction: nextStep?.bannerInstructions[0] || null,
            activeVoiceInstruction: this.getActiveVoiceInstruction(closestStep.voiceInstructions),
        };
    }

    private getActiveVoiceInstruction(voiceInstructions: VoiceInstruction[]) {
        if (!voiceInstructions.length) return null;

        const currentDistance = this.getCurrentDistanceToStep();
        const firstStepInstruction = this.instructions[0].voiceInstructions[0];

        for (let i = 0; i < voiceInstructions.length; i++) {
            const instruction = voiceInstructions[i];
            const distanceDifference = Math.abs(currentDistance - instruction.distanceAlongGeometry);
            const isFirstInstruction = firstStepInstruction.announcement === instruction.announcement;

            if (
                isFirstInstruction ||
                (instruction.distanceAlongGeometry >= currentDistance && distanceDifference <= this.distanceThreshold)
            ) {
                return instruction;
            }
        }

        return null;
    }

    private getUpdateThreshold(speed: number) {
        if (speed <= 30) return 10;
        if (speed <= 50) return 20;
        if (speed <= 80) return 50;
        return 100;
    }

    private getNextStep() {
        return this.instructions[this.currentStepIndex + 1];
    }

    private extractShieldInformation(bannerInstruction: BannerInstruction): RoadShield {
        const icons = bannerInstruction?.primary?.components || [];
        const shieldText = bannerInstruction?.secondary || {};

        const shieldIcon = icons.map((shield) => {
            switch (shield?.type) {
                case ShieldComponentType.ICON:
                    return {
                        type: ShieldComponentType.ICON,
                        name: shield.mapbox_shield?.name || null,
                        display_ref: shield.mapbox_shield?.display_ref || null,
                        text_color: shield.mapbox_shield?.text_color || null,
                    };
                case ShieldComponentType.EXIT_NUMBER:
                    return {
                        type: ShieldComponentType.EXIT_NUMBER,
                        display_ref: shield.text || null,
                    };
                default:
                    return null;
            }
        }) as RoadShield["icon"];

        return {
            icon: shieldIcon,
            text: shieldText?.text || null,
        };
    }

    private extractLaneInformation(bannerInstruction: BannerInstruction): Lane[] {
        const laneInformations = bannerInstruction?.sub?.components?.filter((component) => component.type === "lane");

        return laneInformations?.map((lane) => ({
            active: lane.active || false,
            active_direction: lane.active_direction || null,
            directions: lane.directions || [],
        }));
    }
}

export default Instructions;
