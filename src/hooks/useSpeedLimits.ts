import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";
import { distance, lineString, nearestPointOnLine, point } from "@turf/turf";

import { THRESHOLD } from "@/constants/env-constants";
import { AuthContext } from "@/contexts/AuthContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchSpeedLimits } from "@/services/speed-limits";
import { mapNavigationSelectors } from "@/store/mapNavigation";
import { SpeedLimitAlert } from "@/types/ISpeed";

const useSpeedLimits = () => {
    const { authToken } = useContext(AuthContext);
    const { userLocation } = useContext(UserLocationContext);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const [speedLimits, setSpeedLimits] = useState<SpeedLimitAlert | null>(null);

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;

    const {
        data,
        isLoading: loadingSpeedLimits,
        error: errorSpeedLimits,
    } = useQuery({
        queryKey: ["speedLimits", isNavigationMode],
        queryFn: () =>
            fetchSpeedLimits({
                authToken: String(authToken?.token),
                userLonLat: { lon: longitude, lat: latitude },
                distance: THRESHOLD.SPEED_LIMIT.SHOW_IN_METERS,
            }),
        enabled: !!longitude && !!latitude && isNavigationMode && !!authToken?.token,
        staleTime: Infinity,
        refetchInterval: THRESHOLD.SPEED_LIMIT.SHOW_IN_METERS,
    });

    useEffect(() => {
        if (data && longitude && latitude && isNavigationMode) {
            let closestSpeedLimit: SpeedLimitAlert | null = null;

            data?.features?.forEach((feature) => {
                if (feature.geometry.type === "LineString") {
                    const userPoint = point([longitude, latitude]);
                    const line = lineString(feature.geometry.coordinates as [[number, number]]);
                    const closestPoint = nearestPointOnLine(line, userPoint);
                    const distanceToLine = distance(userPoint, closestPoint, {
                        units: "meters",
                    });

                    const isWithinWarningDistance = distanceToLine <= THRESHOLD.SPEED_LIMIT.SHOW_IN_METERS;
                    const isCloserThanPrevious = !closestSpeedLimit || distanceToLine < closestSpeedLimit.distance;

                    if (isWithinWarningDistance && isCloserThanPrevious) {
                        closestSpeedLimit = {
                            distance: distanceToLine,
                            feature,
                        };
                    }
                }
            });

            setSpeedLimits(closestSpeedLimit);
        } else {
            setSpeedLimits(null);
        }
    }, [data, isNavigationMode]);

    return { speedLimits, loadingSpeedLimits, errorSpeedLimits };
};

export default useSpeedLimits;
