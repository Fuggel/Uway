import { useEffect, useState } from "react";
import { Direction, Instruction } from "../types/IMap";
import { NEXT_STEP_THRESHOLD_IN_METERS } from "../constants/map-constants";
import Mapbox from "@rnmapbox/maps";
import { point, distance } from "@turf/turf";

export default function useInstructions(directions: Direction | null, userLocation: Mapbox.Location | null) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (directions && userLocation) {
            const steps = directions.legs[0].steps;
            const nextStep = steps[currentStep + 1] as Instruction;

            if (nextStep) {
                const userPoint = point([userLocation.coords.longitude, userLocation.coords.latitude]);
                const stepPoint = point(nextStep.maneuver.location);

                const distanceToNextStep = distance(userPoint, stepPoint, { units: "meters" });

                if (distanceToNextStep < NEXT_STEP_THRESHOLD_IN_METERS) {
                    setCurrentStep(currentStep + 1);
                }
            }
        }
    }, [userLocation, currentStep]);

    return { currentStep, setCurrentStep };
}