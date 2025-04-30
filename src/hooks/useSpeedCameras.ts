import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "@turf/helpers";

import { REFETCH_INTERVAL } from "@/constants/env-constants";
import { DEFAULT_FC } from "@/constants/map-constants";
import { AuthContext } from "@/contexts/AuthContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchSpeedCameras } from "@/services/speed-cameras";
import { mapSpeedCameraSelectors } from "@/store/mapSpeedCamera";
import { WarningType } from "@/types/IWarning";

import useWarningListener from "./useWarningListener";

const useSpeedCameras = () => {
    const { authToken } = useContext(AuthContext);
    const { userLocation } = useContext(UserLocationContext);
    const showSpeedCameras = useSelector(mapSpeedCameraSelectors.showSpeedCameras);
    const playAcousticWarning = useSelector(mapSpeedCameraSelectors.playAcousticWarning);
    const [speedCameras, setSpeedCameras] = useState<FeatureCollection | undefined>(undefined);
    const { warning: speedCameraWarning } = useWarningListener({
        eventType: WarningType.SPEED_CAMERA,
        playAcousticWarning,
        userLocation,
    });

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;

    const {
        data,
        isLoading: loadingSpeedCameras,
        error: errorSpeedCameras,
    } = useQuery({
        queryKey: ["speedCameras", showSpeedCameras],
        queryFn: () =>
            fetchSpeedCameras({
                authToken: String(authToken?.token),
                userLonLat: { lon: longitude, lat: latitude },
            }),
        enabled: showSpeedCameras && !!authToken?.token && !!longitude && !!latitude,
        staleTime: Infinity,
        refetchInterval: REFETCH_INTERVAL.SPEED_CAMERAS_IN_MINUTES,
    });

    useEffect(() => {
        if (!data || !showSpeedCameras || !longitude || !latitude) {
            setSpeedCameras(DEFAULT_FC);
            return;
        }

        setSpeedCameras(data);
    }, [data, showSpeedCameras, longitude, latitude]);

    return { speedCameras, speedCameraWarning, loadingSpeedCameras, errorSpeedCameras };
};

export default useSpeedCameras;
