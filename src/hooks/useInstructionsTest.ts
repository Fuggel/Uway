import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";

import { point } from "@turf/helpers";
import { nearestPointOnLine } from "@turf/turf";

import { UserLocationContext } from "@/contexts/UserLocationContext";
import { mapNavigationSelectors } from "@/store/mapNavigation";

const useInstructionsTest = () => {
    const { userLocation } = useContext(UserLocationContext);
    const directions = useSelector(mapNavigationSelectors.directions);

    function getCurrentStepAndInstruction(route: any, currentPosition: any) {
        const steps = route.legs[0].steps;
        const annotations = route.legs[0].annotation;
        let closestStep: any = null;
        let minDistance = Infinity;
        let closestIndex = -1;

        steps.forEach((step: any, stepIndex: number) => {
            const line: any = {
                type: "LineString",
                coordinates: step.geometry.coordinates,
            };

            const userPoint = point(currentPosition);
            const snappedPoint = nearestPointOnLine(line, userPoint);
            const distanceToStep = snappedPoint.properties.dist;

            if (distanceToStep < minDistance) {
                minDistance = distanceToStep;
                closestStep = step;
                closestIndex = stepIndex;
            }
        });

        const activeManeuverInstruction = closestStep?.maneuver?.instruction || "Keine Info";

        const activeBannerInstruction =
            closestStep?.bannerInstructions?.find(
                (instruction: any) => instruction.distanceAlongGeometry >= minDistance
            ) || closestStep?.bannerInstructions?.[0];

        const extractLaneInformation = (bannerPart: any) => {
            return (
                bannerPart?.components
                    ?.filter((component: any) => component.type === "lane")
                    ?.map((lane: any) => ({
                        active: lane.active || false,
                        activeDirection: lane.active_direction || null,
                        directions: lane.directions || [],
                    })) || []
            );
        };

        const laneInformation = {
            primary: extractLaneInformation(activeBannerInstruction?.primary),
            secondary: extractLaneInformation(activeBannerInstruction?.secondary),
            sub: extractLaneInformation(activeBannerInstruction?.sub),
        };

        const maxSpeed = annotations?.maxspeed?.[closestIndex]?.speed || "Keine Info";

        const totalDistance =
            annotations?.distance?.reduce((acc: number, curr: number) => acc + curr, 0) || "Keine Info";
        const totalDuration =
            annotations?.duration?.reduce((acc: number, curr: number) => acc + curr, 0) || "Keine Info";

        const convertDurationToMinutes = (duration: number) => Math.round(duration / 60);

        return {
            step: closestStep,
            maneuverInstruction: activeManeuverInstruction,
            bannerInstruction: activeBannerInstruction,
            laneInformation,
            maxSpeed,
            totalDistance,
            totalDuration: convertDurationToMinutes(totalDuration),
        };
    }

    useEffect(() => {
        const { maneuverInstruction, bannerInstruction, laneInformation, maxSpeed, totalDistance, totalDuration } =
            getCurrentStepAndInstruction(directions, [userLocation!.coords.longitude, userLocation!.coords.latitude]);

        console.log("Aktuelle Max Speed:", maxSpeed + " km/h");
        console.log("Gesamte Entfernung bis Ziel:", totalDistance + " m");
        console.log("Gesamte Dauer bis Ziel:", totalDuration + " min");
        console.log("Manöver-Anweisung:", maneuverInstruction);
        console.log("Spurinfo (Banner):", bannerInstruction?.primary?.text || "Keine Info");
        console.log("Pfeiltyp:", bannerInstruction?.primary?.type || "Keine Info");
        console.log("Richtung:", bannerInstruction?.primary?.modifier || "Keine Info");
        console.log("Spurinformationen (Primary):", laneInformation.primary);
        console.log("Spurinformationen (Secondary):", laneInformation.secondary);
        console.log("Spurinformationen (Sub):", laneInformation.sub);
    }, [userLocation, directions]);
};

export default useInstructionsTest;
