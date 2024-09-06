import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FeatureCollection } from "@turf/helpers";
import { useSelector } from "react-redux";
import { mapSpeedLimitSelectors } from "../store/mapSpeedLimit";
import { REFETCH_INTERVAL } from "../constants/time-constants";
import { fetchSpeedLimits } from "../services/speed-limits";
import { SpeedLimitAlert } from "../types/ISpeed";
import { DEFAULT_FC, SHOW_SPEED_LIMIT_THRESHOLD_IN_METERS } from "../constants/map-constants";
import { distance, lineString, nearestPointOnLine, point } from "@turf/turf";
import { LonLat } from "../types/IMap";

export default function useSpeedLimits(params: {
    userLonLat: LonLat;
    distance: number;
}) {
    const showSpeedLimits = useSelector(mapSpeedLimitSelectors.showSpeedLimit);
    const [speedLimits, setSpeedLimits] = useState<{ data: FeatureCollection, alert: SpeedLimitAlert | null; }>();

    const { data, isLoading: loadingSpeedLimits, error: errorSpeedLimits } = useQuery({
        queryKey: ["speedLimits", showSpeedLimits],
        queryFn: () => fetchSpeedLimits({ userLonLat: params.userLonLat, distance: params.distance }),
        enabled: showSpeedLimits && !!params.userLonLat,
        refetchInterval: REFETCH_INTERVAL,
    });

    useEffect(() => {
        if (data && showSpeedLimits) {
            let closestSpeedLimit: SpeedLimitAlert | null = null;

            data?.features?.forEach((feature) => {
                if (feature.geometry.type === "LineString") {
                    const { lon, lat } = params.userLonLat;

                    const userPoint = point([lon, lat]);
                    const line = lineString(feature.geometry.coordinates as [[number, number]]);
                    const closestPoint = nearestPointOnLine(line, userPoint);
                    const distanceToLine = distance(userPoint, closestPoint, { units: "meters" });

                    const isWithinWarningDistance = distanceToLine <= SHOW_SPEED_LIMIT_THRESHOLD_IN_METERS;
                    const isCloserThanPrevious = !closestSpeedLimit || distanceToLine < closestSpeedLimit.distance;

                    if (isWithinWarningDistance && isCloserThanPrevious) {
                        closestSpeedLimit = { distance: distanceToLine, feature };
                    }
                }
            });

            setSpeedLimits({ data, alert: closestSpeedLimit });
        } else {
            setSpeedLimits({ data: DEFAULT_FC, alert: null });
        }
    }, [data, params.userLonLat]);

    return { speedLimits, loadingSpeedLimits, errorSpeedLimits };
}