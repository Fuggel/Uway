import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FeatureCollection } from "@turf/helpers";
import { useSelector } from "react-redux";
import { mapSpeedLimitSelectors } from "../store/mapSpeedLimit";
import { fetchSpeedLimits } from "../services/speed-limits";
import { SpeedLimitAlert } from "../types/ISpeed";
import { DEFAULT_FC, SHOW_SPEED_LIMIT_THRESHOLD_IN_METERS } from "../constants/map-constants";
import { distance, lineString, nearestPointOnLine, point } from "@turf/turf";

export default function useSpeedLimits(params: { userLon: number; userLat: number; distance: number }) {
    const showSpeedLimits = useSelector(mapSpeedLimitSelectors.showSpeedLimit);
    const [speedLimits, setSpeedLimits] = useState<{
        data: FeatureCollection;
        alert: SpeedLimitAlert | null;
    }>();

    const {
        data,
        isLoading: loadingSpeedLimits,
        error: errorSpeedLimits,
    } = useQuery({
        queryKey: ["speedLimits", showSpeedLimits],
        queryFn: () =>
            fetchSpeedLimits({
                userLon: params.userLon,
                userLat: params.userLat,
                distance: params.distance,
            }),
        enabled: showSpeedLimits && !!params.userLon && !!params.userLat,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (data && showSpeedLimits) {
            let closestSpeedLimit: SpeedLimitAlert | null = null;

            data?.features?.forEach((feature) => {
                if (feature.geometry.type === "LineString") {
                    const userPoint = point([params.userLon, params.userLat]);
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
    }, [data, params.userLon, params.userLat]);

    return { speedLimits, loadingSpeedLimits, errorSpeedLimits };
}
