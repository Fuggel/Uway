import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { fetchSpeedCameras } from "../services/speed-cameras";
import { FeatureCollection } from "@turf/helpers";
import { point, distance } from "@turf/turf";
import {
    DEFAULT_FC,
    SHOW_SPEED_CAMERA_THRESHOLD_IN_METERS,
    SHOW_SPEED_CAMERA_WARNING_THRESHOLD_IN_METERS,
} from "../constants/map-constants";
import { SpeedCameraAlert } from "../types/ISpeed";
import { useSelector } from "react-redux";
import { mapSpeedCameraSelectors } from "../store/mapSpeedCamera";
import { UserLocationContext } from "../contexts/UserLocationContext";

export default function useSpeedCameras() {
    const { userLocation } = useContext(UserLocationContext);
    const showSpeedCameras = useSelector(mapSpeedCameraSelectors.showSpeedCameras);
    const [speedCameras, setSpeedCameras] = useState<{
        data: FeatureCollection;
        alert: SpeedCameraAlert | null;
    }>();

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

            data?.features?.forEach((feature) => {
                const cameraPoint = point([
                    feature.geometry.coordinates[0] as number,
                    feature.geometry.coordinates[1] as number,
                ]);
                const userPoint = point([longitude, latitude]);
                const distanceToCamera = distance(userPoint, cameraPoint, {
                    units: "meters",
                });

                const isWithinWarningDistance = distanceToCamera <= SHOW_SPEED_CAMERA_WARNING_THRESHOLD_IN_METERS;
                const isCloserThanPrevious = !closestCamera || distanceToCamera < closestCamera.distance;

                if (isWithinWarningDistance && isCloserThanPrevious) {
                    closestCamera = { distance: distanceToCamera };
                }
            });

            setSpeedCameras({ data, alert: closestCamera });
        } else {
            setSpeedCameras({ data: DEFAULT_FC, alert: null });
        }
    }, [data, longitude, latitude]);

    return { speedCameras, loadingSpeedCameras, errorSpeedCameras };
}
