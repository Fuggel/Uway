import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { UserLocationContext } from "@/contexts/UserLocationContext";
import Instructions from "@/lib/Instructions";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { CurrentInstruction } from "@/types/INavigation";
import { getManeuverImage } from "@/utils/map-utils";

const useInstructions = () => {
    const dispatch = useDispatch();
    const { userLocation } = useContext(UserLocationContext);
    const directions = useSelector(mapNavigationSelectors.directions);
    const [currentInstruction, setCurrentInstruction] = useState<CurrentInstruction | null>(null);

    const steps = directions?.legs[0]?.steps;
    const annotations = directions?.legs[0]?.annotation;

    const instructions = new Instructions(steps, annotations, userLocation);

    useEffect(() => {
        if (!steps || !annotations || !userLocation) return;

        const currentInstructions = instructions.getCurrentInstructions();

        if (currentInstructions) {
            setCurrentInstruction(currentInstructions);
        }

        instructions.checkIfArrived(() => {
            dispatch(mapNavigationActions.handleCancelNavigation());
        });
    }, [directions, userLocation]);

    const maneuverImage = () => {
        if (!currentInstruction) return;

        const currentArrowDir = getManeuverImage(
            currentInstruction.bannerInstruction.primary.type,
            currentInstruction.bannerInstruction.primary.modifier,
            currentInstruction.bannerInstruction.primary.degrees
        );

        const nextArrowDir =
            getManeuverImage(
                currentInstruction?.nextBannerInstruction?.primary.type,
                currentInstruction?.nextBannerInstruction?.primary.modifier,
                currentInstruction?.nextBannerInstruction?.primary.degrees
            ) || null;

        return { currentArrowDir, nextArrowDir };
    };

    return { currentInstruction, maneuverImage };
};

export default useInstructions;
