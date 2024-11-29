import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useMutation, useQuery } from "@tanstack/react-query";
import { FeatureCollection, point } from "@turf/helpers";
import { distance } from "@turf/turf";

import { REFETCH_INTERVAL, THRESHOLD } from "@/constants/env-constants";
import { DEFAULT_FC } from "@/constants/map-constants";
import { MapNavigationContext } from "@/contexts/MapNavigationContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchSpeedCameras } from "@/services/speed-cameras";
import { mapNavigationSelectors } from "@/store/mapNavigation";
import { mapSpeedCameraSelectors } from "@/store/mapSpeedCamera";
import { WarningAlert } from "@/types/IMap";
import { SpeedCameraAlert, SpeedCameraProperties } from "@/types/ISpeed";
import { isFeatureRelevant } from "@/utils/map-utils";

import useTextToSpeech from "./useTextToSpeech";

const useSpeedCameras = () => {
    const { userLocation } = useContext(UserLocationContext);
    const { directions: navigationDirections } = useContext(MapNavigationContext);
    const showSpeedCameras = useSelector(mapSpeedCameraSelectors.showSpeedCameras);
    const playAcousticWarning = useSelector(mapSpeedCameraSelectors.playAcousticWarning);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const showWarningThresholdInMeters =
        useSelector(mapSpeedCameraSelectors.showWarningThresholdInMeters) || THRESHOLD.SPEED_CAMERA.WARNING_IN_METERS;
    const { startSpeech } = useTextToSpeech();
    const [speedCameras, setSpeedCameras] = useState<
        { data: FeatureCollection; alert: SpeedCameraAlert | null } | undefined
    >(undefined);
    const [newSpeedCameras, setNewSpeedCameras] = useState<FeatureCollection | null>(null);
    const [hasPlayedWarning, setHasPlayedWarning] = useState(false);
    const [speedCameraWarningText, setSpeedCameraWarningText] = useState<WarningAlert | null>(null);

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;
    const heading = userLocation?.coords?.course || 0;

    const {
        data,
        isLoading: loadingSpeedCameras,
        error: errorSpeedCameras,
    } = useQuery({
        queryKey: ["speedCameras", showSpeedCameras],
        queryFn: () =>
            fetchSpeedCameras({
                userLonLat: { lon: longitude, lat: latitude },
            }),
        enabled: showSpeedCameras && !!longitude && !!latitude,
        staleTime: Infinity,
        refetchInterval: REFETCH_INTERVAL.SPEED_CAMERAS_IN_MINUTES,
    });

    const { mutate: refetchSpeedCameras } = useMutation({
        mutationFn: () => {
            return fetchSpeedCameras({
                userLonLat: { lon: longitude, lat: latitude },
            });
        },
        onSuccess: (data) => {
            setNewSpeedCameras(data);
        },
        onError: (error) => {
            console.log(`Failed to refetch speed cameras: ${error}`);
        },
    });

    useEffect(() => {
        if (data && showSpeedCameras && longitude && latitude) {
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

                if (distanceToFeature > showWarningThresholdInMeters) {
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

                const isWithinWarningDistance = distanceToFeature <= showWarningThresholdInMeters;
                const isCloserThanPrevious = !closestCamera || distanceToFeature < closestCamera.distance;

                if (isNavigationMode && isRelevant && isWithinWarningDistance && isCloserThanPrevious) {
                    isWithinAnyWarningZone = true;
                    closestCamera = { distance: distanceToFeature };
                }

                if (
                    isNavigationMode &&
                    playAcousticWarning &&
                    isWithinWarningDistance &&
                    !hasPlayedWarning &&
                    speedCameraWarningText?.textToSpeech &&
                    isRelevant
                ) {
                    startSpeech(speedCameraWarningText.textToSpeech);
                    setHasPlayedWarning(true);
                }
            });

            if (!isWithinAnyWarningZone) {
                setHasPlayedWarning(false);
            }

            setSpeedCameras({ data: { ...data, ...newSpeedCameras }, alert: closestCamera });
        } else {
            setSpeedCameras({ data: DEFAULT_FC, alert: null });
            setHasPlayedWarning(false);
        }
    }, [data, longitude, latitude, hasPlayedWarning, showWarningThresholdInMeters, newSpeedCameras, isNavigationMode]);

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

    return { speedCameras, speedCameraWarningText, refetchSpeedCameras, loadingSpeedCameras, errorSpeedCameras };
};

export default useSpeedCameras;
