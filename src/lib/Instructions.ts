import { Location } from "@rnmapbox/maps";
import { LineString, point } from "@turf/helpers";
import { distance, nearestPointOnLine } from "@turf/turf";

import {
    Annotation,
    BannerInstruction,
    BannerProperties,
    CurrentInstruction,
    Instruction,
    Lane,
} from "@/types/INavigation";

class Instructions {
    public instructions: Instruction[];
    public annotation: Annotation;
    private userPosition: Location | null;
    private currentStepIndex = 0;

    constructor(instructions: Instruction[], annotation: Annotation, userPosition: Location | null) {
        this.instructions = instructions;
        this.annotation = annotation;
        this.userPosition = userPosition;
    }

    public getCurrentInstructions(): CurrentInstruction | undefined {
        return this.determineCurrentInstructions();
    }

    private determineCurrentInstructions(): CurrentInstruction | undefined {
        let closestStep: Instruction = {} as Instruction;
        let minDistance = Infinity;

        this.instructions.forEach((step, stepIndex) => {
            if (!this.userPosition) return;

            const userPoint = point([this.userPosition.coords.longitude, this.userPosition.coords.latitude]);
            const line = { type: "LineString", coordinates: step.geometry.coordinates } as LineString;

            const snappedPoint = nearestPointOnLine(line, userPoint);

            if (snappedPoint.properties.dist < minDistance) {
                minDistance = snappedPoint.properties.dist;
                closestStep = step;
                this.currentStepIndex = stepIndex;
            }
        });

        if (closestStep) {
            const { activeManeuverInstruction, activeBannerInstruction, activeVoiceInstruction } =
                this.getActiveInstruction(closestStep, minDistance);

            return {
                step: closestStep,
                maneuverInstruction: activeManeuverInstruction,
                voiceInstruction: activeVoiceInstruction,
                bannerInstruction: activeBannerInstruction,
                laneInformation: this.getLaneInformation(activeBannerInstruction),
                maxSpeed: this.getCurrentSpeedLimit(),
                remainingDistance: this.getRemainingInfo().remainingDistance,
                remainingDuration: this.getRemainingInfo().remainingDuration,
                distanceToNextStep: this.getCurrentDistanceToStep(),
            };
        }
    }

    private getCurrentDistanceToStep() {
        if (!this.userPosition) return 0;

        const nextStep = this.getNextStep();

        const userPoint = point([this.userPosition.coords.longitude, this.userPosition.coords.latitude]);
        const stepPoint = point(nextStep.maneuver.location);

        const distanceToNextStep = distance(userPoint, stepPoint, {
            units: "meters",
        });

        return Math.round(distanceToNextStep);
    }

    private getRemainingInfo() {
        let totalRemainingDistance = 0;
        let totalRemainingTime = 0;

        for (let i = this.currentStepIndex; i < this.instructions.length; i++) {
            totalRemainingDistance += this.instructions[i].distance;
            totalRemainingTime += this.instructions[i].duration;
        }

        const distanceInMeters = totalRemainingDistance / 1000;
        const timeInMinutes = totalRemainingTime / 60;

        return {
            remainingDistance: distanceInMeters.toFixed(1),
            remainingDuration: timeInMinutes.toFixed(0),
        };
    }

    private getCurrentSpeedLimit() {
        const currentSpeedLimit = this.annotation.maxspeed[this.currentStepIndex];
        return currentSpeedLimit ? currentSpeedLimit.speed : 0;
    }

    private getLaneInformation(bannerInstruction: BannerInstruction) {
        const laneInformation = {
            primary: this.extractLaneInformation(bannerInstruction.primary),
            secondary: this.extractLaneInformation(bannerInstruction.secondary),
            sub: this.extractLaneInformation(bannerInstruction.sub),
        };

        return laneInformation;
    }

    private extractLaneInformation(bannerPart: BannerProperties): Lane[] {
        const laneInformations = bannerPart?.components?.filter((component) => component.type === "lane");

        return laneInformations?.map((lane) => ({
            active: lane.active || false,
            activeDirection: lane.active_direction || null,
            directions: lane.directions || [],
        }));
    }

    private getActiveInstruction(closestStep: Instruction, minDistance: number) {
        return {
            activeManeuverInstruction: closestStep.maneuver,
            activeBannerInstruction:
                closestStep.bannerInstructions.find(
                    (instruction) => instruction.distanceAlongGeometry >= minDistance
                ) || closestStep.bannerInstructions[0],
            activeVoiceInstruction:
                closestStep.voiceInstructions.find((instruction) => instruction.distanceAlongGeometry >= minDistance) ||
                closestStep.voiceInstructions[0],
        };
    }

    private getNextStep() {
        return this.instructions[this.currentStepIndex + 1];
    }
}

export default Instructions;
