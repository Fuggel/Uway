import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { UserLocationContext } from "@/contexts/UserLocationContext";
import Instructions from "@/lib/Instructions";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { CurrentInstruction, LaneImage, ManeuverImage } from "@/types/INavigation";
import { getLaneImage, getManeuverImage } from "@/utils/map-utils";

import useTextToSpeech from "./useTextToSpeech";

const useInstructions = () => {
    const dispatch = useDispatch();
    const { userLocation } = useContext(UserLocationContext);
    const { startSpeech } = useTextToSpeech();
    const directions = useSelector(mapNavigationSelectors.directions);
    const spokenInstruction = useSelector(mapNavigationSelectors.spokenInstruction);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const [currentInstruction, setCurrentInstruction] = useState<CurrentInstruction | null>(null);

    const instructions = useMemo(() => {
        const steps = directions?.legs[0]?.steps;
        const annotations = directions?.legs[0]?.annotation;

        if (!steps || !annotations || !userLocation) return null;

        const instructions = new Instructions(steps, annotations, userLocation);

        return {
            getCurrentInstructions: instructions.getCurrentInstructions(),
            checkIfArrived: (onCancel: () => void) => instructions.checkIfArrived(onCancel),
        };
    }, [directions]);

    useEffect(() => {
        if (!instructions) return;

        if (instructions.getCurrentInstructions) {
            setCurrentInstruction(instructions.getCurrentInstructions);
        }

        instructions.checkIfArrived(() => {
            dispatch(mapNavigationActions.handleCancelNavigation());
        });
    }, [instructions]);

    useEffect(() => {
        if (!isNavigationMode || !instructions?.getCurrentInstructions) return;

        const announcement = instructions.getCurrentInstructions?.voiceInstruction?.announcement;

        if (announcement && spokenInstruction !== announcement) {
            dispatch(mapNavigationActions.setSpokenInstruction(announcement));
            startSpeech(announcement);
        }
    }, [isNavigationMode, instructions?.getCurrentInstructions]);

    const maneuverImage = (): ManeuverImage | undefined => {
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

    const laneImages = (): LaneImage | undefined => {
        if (!currentInstruction) return;

        const laneDirections = currentInstruction?.laneInformation?.map((lane) => getLaneImage(lane));
        return laneDirections;
    };

    return { currentInstruction, maneuverImage, laneImages };
};

export default useInstructions;
