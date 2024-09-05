import { useEffect, useState } from "react";
import { Direction, Instruction } from "../types/INavigation";
import { NEXT_STEP_THRESHOLD_IN_METERS } from "../constants/map-constants";
import { point, distance as turfDistance } from "@turf/turf";
import { LocationObject } from "expo-location";

export default function useInstructions(directions: Direction | null, userLocation: LocationObject | null) {
    const [currentStep, setCurrentStep] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [remainingDistance, setRemainingDistance] = useState(0);

    useEffect(() => {
        if (directions && userLocation) {
            const steps = directions.legs[0].steps;
            const nextStep = steps[currentStep + 1] as Instruction;

            const calculateRemainingTimeAndDistance = () => {
                let totalRemainingTime = 0;
                let totalRemainingDistance = 0;

                for (let i = currentStep; i < steps.length; i++) {
                    totalRemainingTime += steps[i].duration;
                    totalRemainingDistance += steps[i].distance;
                }

                setRemainingTime(totalRemainingTime);
                setRemainingDistance(totalRemainingDistance);
            };

            if (nextStep) {
                const userPoint = point([userLocation.coords.longitude, userLocation.coords.latitude]);
                const stepPoint = point(nextStep.maneuver.location);

                const distanceToNextStep = turfDistance(userPoint, stepPoint, { units: "meters" });

                if (distanceToNextStep < NEXT_STEP_THRESHOLD_IN_METERS) {
                    setCurrentStep(currentStep + 1);
                }
            }

            calculateRemainingTimeAndDistance();
        }
    }, [userLocation, currentStep, directions]);

    return { currentStep, setCurrentStep, remainingTime, remainingDistance };
}