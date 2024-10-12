import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "@turf/helpers";
import { distance, lineString, nearestPointOnLine, point } from "@turf/turf";

import { DEFAULT_FC, SHOW_SPEED_LIMIT_THRESHOLD_IN_METERS } from "@/constants/map-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchSpeedLimits } from "@/services/speed-limits";
import { mapSpeedLimitSelectors } from "@/store/mapSpeedLimit";
import { SpeedLimitAlert } from "@/types/ISpeed";

const useSpeedLimits = () => {
    const { userLocation } = useContext(UserLocationContext);
    const showSpeedLimits = useSelector(mapSpeedLimitSelectors.showSpeedLimit);
    const [speedLimits, setSpeedLimits] = useState<{ data: FeatureCollection; alert: SpeedLimitAlert | null }>();

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;

    const {
        data,
        isLoading: loadingSpeedLimits,
        error: errorSpeedLimits,
    } = useQuery({
        queryKey: ["speedLimits", showSpeedLimits],
        queryFn: () =>
            fetchSpeedLimits({
                userLonLat: { lon: longitude, lat: latitude },
                distance: SHOW_SPEED_LIMIT_THRESHOLD_IN_METERS,
            }),
        enabled: showSpeedLimits && !!longitude && !!latitude,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (data && showSpeedLimits && longitude && latitude) {
            let closestSpeedLimit: SpeedLimitAlert | null = null;

            data?.features?.forEach((feature) => {
                if (feature.geometry.type === "LineString") {
                    const userPoint = point([longitude, latitude]);
                    const line = lineString(feature.geometry.coordinates as [[number, number]]);
                    const closestPoint = nearestPointOnLine(line, userPoint);
                    const distanceToLine = distance(userPoint, closestPoint, {
                        units: "meters",
                    });

                    const isWithinWarningDistance = distanceToLine <= SHOW_SPEED_LIMIT_THRESHOLD_IN_METERS;
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
