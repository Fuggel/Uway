import { useEffect, useState } from "react";
import { Direction, Instruction } from "../types/IMap";
import { LocationObject } from "expo-location";
import { haversineDistance } from "../utils/map-utils";
import { NEXT_STEP_THRESHOLD_IN_METERS } from "../constants/map-constants";

export default function useInstructions(directions: Direction | null, userLocation: LocationObject | null) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (directions && userLocation) {
            const steps = directions.legs[0].steps;
            const nextStep = steps[currentStep + 1] as Instruction;

            if (nextStep) {
                const distanceToNextStep = haversineDistance(
                    { lon: userLocation.coords.longitude, lat: userLocation.coords.latitude },
                    { lon: nextStep.maneuver.location[0], lat: nextStep.maneuver.location[1] }
                );

                if (distanceToNextStep < NEXT_STEP_THRESHOLD_IN_METERS) {
                    setCurrentStep(currentStep + 1);
                }
            }
        }
    }, [userLocation, currentStep]);

    return { currentStep, setCurrentStep };
}