import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";

import { REFETCH_INTERVAL } from "@/constants/env-constants";
import { AuthContext } from "@/contexts/AuthContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchSpeedLimits } from "@/services/speed-limits";
import { mapNavigationSelectors } from "@/store/mapNavigation";

const useSpeedLimits = () => {
    const { authToken } = useContext(AuthContext);
    const { userLocation } = useContext(UserLocationContext);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const [speedLimits, setSpeedLimits] = useState<string | null>(null);

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
            }),
        enabled: !!longitude && !!latitude && isNavigationMode && !!authToken?.token,
        staleTime: Infinity,
        refetchInterval: REFETCH_INTERVAL.SPEED_LIMITS_IN_SECONDS,
    });

    useEffect(() => {
        if (data && longitude && latitude && isNavigationMode) {
            setSpeedLimits(data.maxspeed);
        } else {
            setSpeedLimits(null);
        }
    }, [data, isNavigationMode]);

    return { speedLimits, loadingSpeedLimits, errorSpeedLimits };
};

export default useSpeedLimits;
