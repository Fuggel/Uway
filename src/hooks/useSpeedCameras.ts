import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "@turf/helpers";
import { distance, point } from "@turf/turf";

import {
    DEFAULT_FC,
    PLAY_ACOUSTIC_WARNING_SPEED_CAMERA_THRESHOLD_IN_METERS,
    SHOW_SPEED_CAMERA_THRESHOLD_IN_METERS,
    SHOW_SPEED_CAMERA_WARNING_THRESHOLD_IN_METERS,
} from "@/constants/map-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchSpeedCameras } from "@/services/speed-cameras";
import { mapSpeedCameraSelectors } from "@/store/mapSpeedCamera";
import { SpeedCameraAlert, SpeedCameraProperties, WarningAlertSpeed } from "@/types/ISpeed";

import useTextToSpeech from "./useTextToSpeech";

const useSpeedCameras = () => {
    const { userLocation } = useContext(UserLocationContext);
    const showSpeedCameras = useSelector(mapSpeedCameraSelectors.showSpeedCameras);
    const playAcousticWarning = useSelector(mapSpeedCameraSelectors.playAcousticWarning);
    const showWarningThresholdInMeters =
        useSelector(mapSpeedCameraSelectors.showWarningThresholdInMeters) ||
        SHOW_SPEED_CAMERA_WARNING_THRESHOLD_IN_METERS;
    const playAcousticWarningThresholdInMeters =
        useSelector(mapSpeedCameraSelectors.playAcousticWarningThresholdInMeters) ||
        PLAY_ACOUSTIC_WARNING_SPEED_CAMERA_THRESHOLD_IN_METERS;
    const { startSpeech } = useTextToSpeech();
    const [speedCameras, setSpeedCameras] = useState<{ data: FeatureCollection; alert: SpeedCameraAlert | null }>();
    const [hasPlayedWarning, setHasPlayedWarning] = useState(false);
    const [speedCameraWarningText, setSpeedCameraWarningText] = useState<WarningAlertSpeed | null>(null);

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
                userLonLat: { lon: longitude, lat: latitude },
                distance: SHOW_SPEED_CAMERA_THRESHOLD_IN_METERS,
            }),
        enabled: showSpeedCameras && !!longitude && !!latitude,
        staleTime: Infinity,
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
                const distanceToCamera = distance(userPoint, cameraPoint, {
                    units: "meters",
                });

                const isWithinWarningDistance = distanceToCamera <= showWarningThresholdInMeters;
                const isWithinAcousticWarningDistance = distanceToCamera <= playAcousticWarningThresholdInMeters;
                const isCloserThanPrevious = !closestCamera || distanceToCamera < closestCamera.distance;

                if (isWithinWarningDistance && isCloserThanPrevious) {
                    closestCamera = { distance: distanceToCamera };
                    isWithinAnyWarningZone = true;

                    setSpeedCameraWarningText({
                        ...speedCameraWarningText,
                        maxSpeed: (feature.properties as unknown as SpeedCameraProperties).maxspeed,
                    });
                }

                if (
                    playAcousticWarning &&
                    isWithinAcousticWarningDistance &&
                    !hasPlayedWarning &&
                    speedCameraWarningText?.textToSpeech
                ) {
                    startSpeech(speedCameraWarningText.textToSpeech);
                    setHasPlayedWarning(true);
                }
            });

            if (!isWithinAnyWarningZone) {
                setHasPlayedWarning(false);
            }

            setSpeedCameras({ data, alert: closestCamera });
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
    ]);

    useEffect(() => {
        if (speedCameras?.alert) {
            const distance = speedCameras.alert.distance.toFixed(0);

            setSpeedCameraWarningText({
                ...speedCameraWarningText,
                textToSpeech: `Blitzer in ${distance} Metern. Maximalgeschwindigkeit ${speedCameraWarningText?.maxSpeed} km/h`,
                title: `Blitzer in ${distance} m.`,
                subTitle: `Max. ${speedCameraWarningText?.maxSpeed} km/h`,
            });
        }
    }, [speedCameras?.alert]);

    return { speedCameras, speedCameraWarningText, loadingSpeedCameras, errorSpeedCameras };
};

export default useSpeedCameras;
