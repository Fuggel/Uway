import { useContext, useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "@turf/helpers";
import { distance, lineString, nearestPointOnLine, point } from "@turf/turf";

import { THRESHOLD } from "@/constants/env-constants";
import { DEFAULT_FC } from "@/constants/map-constants";
import { AuthContext } from "@/contexts/AuthContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchSpeedLimits } from "@/services/speed-limits";
import { SpeedLimitAlert } from "@/types/ISpeed";

const useSpeedLimits = () => {
    const { authToken } = useContext(AuthContext);
    const { userLocation } = useContext(UserLocationContext);
    const [speedLimits, setSpeedLimits] = useState<{ data: FeatureCollection; alert: SpeedLimitAlert | null }>();

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;

    const {
        data,
        isLoading: loadingSpeedLimits,
        error: errorSpeedLimits,
    } = useQuery({
        queryKey: ["speedLimits"],
        queryFn: () =>
            fetchSpeedLimits({
                authToken: String(authToken?.token),
                userLonLat: { lon: longitude, lat: latitude },
                distance: THRESHOLD.SPEED_LIMIT.SHOW_IN_METERS,
            }),
        enabled: !!longitude && !!latitude,
        staleTime: Infinity,
        refetchInterval: THRESHOLD.SPEED_LIMIT.SHOW_IN_METERS,
    });

    useEffect(() => {
        if (data && longitude && latitude) {
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

            setSpeedLimits({ data, alert: closestSpeedLimit });
        } else {
            setSpeedLimits({ data: DEFAULT_FC, alert: null });
        }
    }, [data, longitude, latitude]);

    return { speedLimits, loadingSpeedLimits, errorSpeedLimits };
};

export default useSpeedLimits;
