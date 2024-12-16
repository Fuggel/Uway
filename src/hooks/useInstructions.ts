import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { point, distance as turfDistance } from "@turf/turf";

import { THRESHOLD } from "@/constants/env-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { Instruction } from "@/types/INavigation";

const useInstructions = () => {
    const { userLocation } = useContext(UserLocationContext);
    const dispatch = useDispatch();
    const directions = useSelector(mapNavigationSelectors.directions);
    const currentStep = useSelector(mapNavigationSelectors.currentStep);
    const [remainingTime, setRemainingTime] = useState(0);
    const [remainingDistance, setRemainingDistance] = useState(0);
    const [currentSpeedLimit, setCurrentSpeedLimit] = useState<number | null>(null);

    useEffect(() => {
        if (directions && userLocation) {
            const steps = directions.legs[0].steps;
            const annotations = directions.legs[0].annotation;

            const calculateSpeedLimit = (stepIndex: number) => {
                const geometryIndex = steps[stepIndex].intersections[0]?.geometry_index;

                if (geometryIndex !== undefined && annotations?.maxspeed[geometryIndex]) {
                    const speedLimit = annotations.maxspeed[geometryIndex]?.speed;
                    setCurrentSpeedLimit(speedLimit || null);
                    console.log("Speed limit for step:", stepIndex, speedLimit);
                }
            };

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

            const handleStepTransition = () => {
                const nextStep = steps[currentStep + 1] as Instruction;

                if (nextStep) {
                    const userPoint = point([userLocation.coords.longitude, userLocation.coords.latitude]);
                    const stepPoint = point(nextStep.maneuver.location);

                    const distanceToNextStep = turfDistance(userPoint, stepPoint, {
                        units: "meters",
                    });

                    if (distanceToNextStep < THRESHOLD.NAVIGATION.NEXT_STEP_IN_METERS) {
                        dispatch(mapNavigationActions.setCurrentStep(currentStep + 1));
                    }
                }
            };

            calculateSpeedLimit(currentStep);
            calculateRemainingTimeAndDistance();
            handleStepTransition();
        }
    }, [userLocation, currentStep, directions]);

    return { remainingTime, remainingDistance, currentSpeedLimit };
};

export default useInstructions;
