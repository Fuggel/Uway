import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useMutation, useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "@turf/helpers";
import { bearing, distance, point } from "@turf/turf";

import { REFETCH_INTERVAL, THRESHOLD } from "@/constants/env-constants";
import { DEFAULT_FC } from "@/constants/map-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchSpeedCameras } from "@/services/speed-cameras";
import { mapNavigationSelectors } from "@/store/mapNavigation";
import { mapSpeedCameraSelectors } from "@/store/mapSpeedCamera";
import { WarningAlert } from "@/types/IMap";
import { SpeedCameraAlert, SpeedCameraProperties } from "@/types/ISpeed";

import useTextToSpeech from "./useTextToSpeech";

const useSpeedCameras = () => {
    const { userLocation } = useContext(UserLocationContext);
    const showSpeedCameras = useSelector(mapSpeedCameraSelectors.showSpeedCameras);
    const playAcousticWarning = useSelector(mapSpeedCameraSelectors.playAcousticWarning);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const showWarningThresholdInMeters =
        useSelector(mapSpeedCameraSelectors.showWarningThresholdInMeters) ||
        THRESHOLD.SPEED_CAMERA.SHOW_WARNING_IN_METERS;
    const playAcousticWarningThresholdInMeters =
        useSelector(mapSpeedCameraSelectors.playAcousticWarningThresholdInMeters) ||
        THRESHOLD.SPEED_CAMERA.PLAY_ACOUSTIC_WARNING_IN_METERS;
    const { startSpeech } = useTextToSpeech();
    const [speedCameras, setSpeedCameras] = useState<
        { data: FeatureCollection; alert: SpeedCameraAlert | null } | undefined
    >(undefined);
    const [newSpeedCameras, setNewSpeedCameras] = useState<FeatureCollection | null>(null);
    const [hasPlayedWarning, setHasPlayedWarning] = useState(false);
    const [speedCameraWarningText, setSpeedCameraWarningText] = useState<WarningAlert | null>(null);

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;
    const heading = userLocation?.coords?.heading || 0;

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
                const cameraPoint = point([
                    feature.geometry.coordinates[0] as number,
                    feature.geometry.coordinates[1] as number,
                ]);
                const userPoint = point([longitude, latitude]);
                const distanceToCamera = distance(userPoint, cameraPoint, { units: "meters" });

                const directionsString = (feature.properties as unknown as SpeedCameraProperties).direction;
                const directions = directionsString ? directionsString.split(";").map(Number) : [];

                const bearingToCamera = bearing(userPoint, cameraPoint);

                const angleDifference = Math.abs(heading - bearingToCamera);
                const isCameraAhead = angleDifference <= 90 || angleDifference >= 270;

                const isSameLane = directions.some((dir) => {
                    const oppositeDir = (dir + 180) % 360;

                    return (
                        Math.abs(heading - oppositeDir) < THRESHOLD.SPEED_CAMERA.IS_ON_SAME_LANE_IN_DEGREES ||
                        Math.abs(heading - oppositeDir) > 360 - THRESHOLD.SPEED_CAMERA.IS_ON_SAME_LANE_IN_DEGREES
                    );
                });

                const isWithinWarningDistance = distanceToCamera <= showWarningThresholdInMeters;
                const isWithinAcousticWarningDistance = distanceToCamera <= playAcousticWarningThresholdInMeters;
                const isCloserThanPrevious = !closestCamera || distanceToCamera < closestCamera.distance;

                if (isSameLane && isCameraAhead && isWithinWarningDistance && isCloserThanPrevious) {
                    isWithinAnyWarningZone = true;
                    closestCamera = { distance: distanceToCamera };
                }

                if (
                    isNavigationMode &&
                    playAcousticWarning &&
                    isWithinAcousticWarningDistance &&
                    !hasPlayedWarning &&
                    speedCameraWarningText?.textToSpeech &&
                    isSameLane
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
    }, [
        data,
        longitude,
        latitude,
        hasPlayedWarning,
        playAcousticWarningThresholdInMeters,
        showWarningThresholdInMeters,
        newSpeedCameras,
    ]);

    useEffect(() => {
        if (speedCameras?.alert && isNavigationMode) {
            const distance = speedCameras.alert.distance.toFixed(0);

            setSpeedCameraWarningText({
                ...speedCameraWarningText,
                textToSpeech: `Blitzer in ${distance} Metern.`,
                title: `Blitzer in ${distance} m.`,
            });
        }
    }, [speedCameras?.alert, isNavigationMode]);

    return { speedCameras, speedCameraWarningText, refetchSpeedCameras, loadingSpeedCameras, errorSpeedCameras };
};

export default useSpeedCameras;
