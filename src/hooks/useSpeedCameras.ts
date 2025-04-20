import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";
import { FeatureCollection, point } from "@turf/helpers";
import { distance } from "@turf/turf";

import { REFETCH_INTERVAL, THRESHOLD } from "@/constants/env-constants";
import { DEFAULT_FC } from "@/constants/map-constants";
import { AuthContext } from "@/contexts/AuthContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchSpeedCameras } from "@/services/speed-cameras";
import { mapNavigationSelectors } from "@/store/mapNavigation";
import { mapSpeedCameraSelectors } from "@/store/mapSpeedCamera";
import { WarningAlert } from "@/types/IMap";
import { SpeedCameraAlert, SpeedCameraProperties } from "@/types/ISpeed";
import { convertSpeedToKmh, isFeatureRelevant, warningThresholds } from "@/utils/map-utils";

import useTextToSpeech from "./useTextToSpeech";

const useSpeedCameras = () => {
    const { authToken } = useContext(AuthContext);
    const { userLocation } = useContext(UserLocationContext);
    const navigationDirections = useSelector(mapNavigationSelectors.directions);
    const showSpeedCameras = useSelector(mapSpeedCameraSelectors.showSpeedCameras);
    const playAcousticWarning = useSelector(mapSpeedCameraSelectors.playAcousticWarning);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const { startSpeech } = useTextToSpeech();
    const [speedCameras, setSpeedCameras] = useState<
        { data: FeatureCollection; alert: SpeedCameraAlert | null } | undefined
    >(undefined);
    const [hasPlayedWarning, setHasPlayedWarning] = useState({ early: false, late: false });
    const [speedCameraWarningText, setSpeedCameraWarningText] = useState<WarningAlert | null>(null);

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;
    const heading = userLocation?.coords?.course || 0;
    const userSpeed = userLocation?.coords.speed || 0;
    const currentSpeed = userSpeed && userSpeed > 0 ? convertSpeedToKmh(userSpeed) : 0;

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
        if (data && showSpeedCameras && longitude && latitude) {
            const { early, late } = warningThresholds(currentSpeed);
            let closestCamera: SpeedCameraAlert | null = null;
            let isWithinAnyWarningZone = false;

            data?.features?.forEach((feature) => {
                const userPoint: [number, number] = [longitude, latitude];
                const cameraPoint: [number, number] = [
                    feature.geometry.coordinates[0] as number,
                    feature.geometry.coordinates[1] as number,
                ];

                const distanceToFeature = distance(point(userPoint), point(cameraPoint), {
                    units: "meters",
                });

                if (distanceToFeature > early) {
                    return;
                }

                const directionsString = (feature.properties as unknown as SpeedCameraProperties).direction;
                const directions = directionsString ? directionsString.split(";").map(Number) : [];

                const { isRelevant } = isFeatureRelevant({
                    userPoint: userPoint,
                    featurePoint: cameraPoint,
                    heading,
                    directions,
                    tolerance: THRESHOLD.NAVIGATION.IS_AHEAD_IN_DEGREES,
                    laneThreshold: THRESHOLD.NAVIGATION.IS_ON_SAME_LANE_IN_DEGREES,
                    route: navigationDirections?.geometry.coordinates,
                    routeBufferTolerance: THRESHOLD.NAVIGATION.ROUTE_BUFFER_TOLERANCE,
                });

                const isWithinEarlyWarningDistance = distanceToFeature <= early;
                const isWithinLateWarningDistance = distanceToFeature <= late;
                const isCloserThanPrevious = !closestCamera || distanceToFeature < closestCamera.distance;

                if (
                    isNavigationMode &&
                    isRelevant &&
                    (isWithinEarlyWarningDistance || isWithinLateWarningDistance) &&
                    isCloserThanPrevious
                ) {
                    isWithinAnyWarningZone = true;
                    closestCamera = { distance: distanceToFeature };
                }

                if (isNavigationMode && playAcousticWarning && isRelevant && speedCameraWarningText?.textToSpeech) {
                    if (!hasPlayedWarning.early && isWithinEarlyWarningDistance) {
                        startSpeech(speedCameraWarningText.textToSpeech);
                        setHasPlayedWarning((prev) => ({ ...prev, early: true }));
                    } else if (!hasPlayedWarning.late && isWithinLateWarningDistance) {
                        startSpeech(speedCameraWarningText.textToSpeech);
                        setHasPlayedWarning((prev) => ({ ...prev, late: true }));
                    }
                }
            });

            if (!isWithinAnyWarningZone) {
                setHasPlayedWarning({ early: false, late: false });
            }

            setSpeedCameras({ data, alert: closestCamera });
        } else {
            setSpeedCameras({ data: DEFAULT_FC, alert: null });
            setHasPlayedWarning({ early: false, late: false });
        }
    }, [data, longitude, latitude, isNavigationMode]);

    useEffect(() => {
        if (speedCameras?.alert) {
            const distance = speedCameras.alert.distance.toFixed(0);

            setSpeedCameraWarningText({
                ...speedCameraWarningText,
                textToSpeech: `Blitzer in ${distance} Metern.`,
                title: `Blitzer in ${distance} m.`,
            });
        }
    }, [speedCameras?.alert]);

    return { speedCameras, speedCameraWarningText, loadingSpeedCameras, errorSpeedCameras };
};

export default useSpeedCameras;
