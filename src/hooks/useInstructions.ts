import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { UserLocationContext } from "@/contexts/UserLocationContext";
import Instructions from "@/lib/Instructions";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { CurrentInstruction, LaneImage, ManeuverImage } from "@/types/INavigation";
import { getLaneImage, getManeuverImage } from "@/utils/map-utils";

import useTextToSpeech from "./useTextToSpeech";

const useInstructions = () => {
    const dispatch = useDispatch();
    const instructionsRef = useRef<Instructions | null>(null);
    const { userLocation } = useContext(UserLocationContext);
    const { startSpeech } = useTextToSpeech();
    const directions = useSelector(mapNavigationSelectors.directions);
    const spokenInstruction = useSelector(mapNavigationSelectors.spokenInstruction);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const [currentInstruction, setCurrentInstruction] = useState<CurrentInstruction | undefined>(undefined);

    useEffect(() => {
        const steps = directions?.legs[0]?.steps || [];
        const annotation = directions?.legs[0]?.annotation || {};

        if (directions) {
            instructionsRef.current = new Instructions(steps, annotation, userLocation);
        }
    }, [directions]);

    useEffect(() => {
        if (instructionsRef.current && userLocation) {
            instructionsRef.current.userPosition = userLocation;

            const updatedInstruction = instructionsRef.current.getCurrentInstructions();
            setCurrentInstruction(updatedInstruction);

            instructionsRef.current.checkIfArrived(() => {
                dispatch(mapNavigationActions.handleCancelNavigation());
            });
        }
    }, [userLocation]);

    useEffect(() => {
        if (!isNavigationMode || !currentInstruction) return;

        const announcement = currentInstruction.voiceInstruction?.announcement;

        if (announcement && spokenInstruction !== announcement) {
            dispatch(mapNavigationActions.setSpokenInstruction(announcement));
            startSpeech(announcement);
        }
    }, [isNavigationMode, currentInstruction]);

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
