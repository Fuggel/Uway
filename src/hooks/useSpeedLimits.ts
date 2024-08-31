import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FeatureCollection } from "@turf/helpers";
import { useSelector } from "react-redux";
import { mapSpeedLimitSelectors } from "../store/mapSpeedLimit";
import { REFETCH_INTERVAL } from "../constants/time-constants";
import { fetchSpeedLimits } from "../services/speed-limits";

export default function useSpeedLimits(params: {
    userLon: number,
    userLat: number,
    distance: number;
}) {
    const showSpeedLimits = useSelector(mapSpeedLimitSelectors.showSpeedLimit);
    const [speedLimits, setSpeedLimits] = useState<FeatureCollection | null>();

    const { data, isLoading: loadingSpeedLimits, error: errorSpeedLimits } = useQuery({
        queryKey: ["speedLimits", showSpeedLimits],
        queryFn: () => fetchSpeedLimits({ userLon: params.userLon, userLat: params.userLat, distance: params.distance }),
        enabled: showSpeedLimits && !!params.userLon && !!params.userLat,
        refetchInterval: REFETCH_INTERVAL,
    });

    useEffect(() => {
        if (data) {
            setSpeedLimits(data);
        }
    }, [data]);

    return { speedLimits, loadingSpeedLimits, errorSpeedLimits };
}