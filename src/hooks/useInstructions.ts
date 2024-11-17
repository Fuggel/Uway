import { useEffect, useState } from "react";

import { Location } from "@rnmapbox/maps";
import { point, distance as turfDistance } from "@turf/turf";

import { THRESHOLD } from "@/constants/env-constants";
import { Direction, Instruction } from "@/types/INavigation";

const useInstructions = (params: {
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    directions: Direction | null;
    userLocation: Location | null;
}) => {
    const [remainingTime, setRemainingTime] = useState(0);
    const [remainingDistance, setRemainingDistance] = useState(0);

    useEffect(() => {
        if (params.directions && params.userLocation) {
            const steps = params.directions.legs[0].steps;
            const nextStep = steps[params.currentStep + 1] as Instruction;

            const calculateRemainingTimeAndDistance = () => {
                let totalRemainingTime = 0;
                let totalRemainingDistance = 0;

                for (let i = params.currentStep; i < steps.length; i++) {
                    totalRemainingTime += steps[i].duration;
                    totalRemainingDistance += steps[i].distance;
                }

                setRemainingTime(totalRemainingTime);
                setRemainingDistance(totalRemainingDistance);
            };

            if (nextStep) {
                const userPoint = point([params.userLocation.coords.longitude, params.userLocation.coords.latitude]);
                const stepPoint = point(nextStep.maneuver.location);

                const distanceToNextStep = turfDistance(userPoint, stepPoint, {
                    units: "meters",
                });

                if (distanceToNextStep < THRESHOLD.NAVIGATION.NEXT_STEP_IN_METERS) {
                    params.setCurrentStep(params.currentStep + 1);
                }
            }

            calculateRemainingTimeAndDistance();
        }
    }, [params.userLocation, params.currentStep, params.directions]);

    return { remainingTime, remainingDistance };
};

export default useInstructions;
