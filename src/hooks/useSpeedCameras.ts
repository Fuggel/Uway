import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchSpeedCameras } from "../services/speed-cameras";
import { FeatureCollection } from "@turf/helpers";
import { point, distance } from "@turf/turf";
import { DEFAULT_FC, SHOW_SPEED_CAMERA_WARNING_THRESHOLD_IN_METERS } from "../constants/map-constants";
import { SpeedCameraAlert } from "../types/ISpeed";
import { useSelector } from "react-redux";
import { mapSpeedCameraSelectors } from "../store/mapSpeedCamera";

export default function useSpeedCameras(params: {
    userLon: number,
    userLat: number,
    distance: number;
}) {
    const showSpeedCameras = useSelector(mapSpeedCameraSelectors.showSpeedCameras);
    const [speedCameras, setSpeedCameras] = useState<{ data: FeatureCollection, alert: SpeedCameraAlert | null; }>();

    const { data, isLoading: loadingSpeedCameras, error: errorSpeedCameras } = useQuery({
        queryKey: ["speedCameras", showSpeedCameras],
        queryFn: () => fetchSpeedCameras({
            userLon: params.userLon,
            userLat: params.userLat,
            distance: params.distance
        }),
        enabled: showSpeedCameras && !!params.userLon && !!params.userLat,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (data && showSpeedCameras) {
            let closestCamera: SpeedCameraAlert | null = null;

            data?.features?.forEach((feature) => {
                const cameraPoint = point([
                    feature.geometry.coordinates[0] as number,
                    feature.geometry.coordinates[1] as number,
                ]);
                const userPoint = point([params.userLon, params.userLat]);
                const distanceToCamera = distance(userPoint, cameraPoint, { units: "meters" });

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
    }, [data, params.userLon, params.userLat]);

    return { speedCameras, loadingSpeedCameras, errorSpeedCameras };
}