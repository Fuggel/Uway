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

                const distanceToNextStep = turfDistance(userPoint, stepPoint, {
                    units: "meters",
                });

                if (distanceToNextStep < THRESHOLD.NAVIGATION.NEXT_STEP_IN_METERS) {
                    dispatch(mapNavigationActions.setCurrentStep(currentStep + 1));
                }
            }

            calculateRemainingTimeAndDistance();
        }
    }, [userLocation, currentStep, directions]);

    return { remainingTime, remainingDistance };
};

export default useInstructions;
