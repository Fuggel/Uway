import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchSpeedCameras } from "../services/speed-cameras";
import { FeatureCollection } from "@turf/helpers";
import { point, distance } from "@turf/turf";
import { DEFAULT_FC, SHOW_SPEED_CAMERA_WARNING_THRESHOLD_IN_METERS } from "../constants/map-constants";
import { SpeedCameraAlert } from "../types/ISpeed";
import { useSelector } from "react-redux";
import { mapSpeedCameraSelectors } from "../store/mapSpeedCamera";
import { REFETCH_INTERVAL } from "../constants/time-constants";
import { LonLat } from "../types/IMap";

export default function useSpeedCameras(params: {
    userLonLat: LonLat;
    distance: number;
}) {
    const showSpeedCameras = useSelector(mapSpeedCameraSelectors.showSpeedCameras);
    const [speedCameras, setSpeedCameras] = useState<{ data: FeatureCollection, alert: SpeedCameraAlert | null; }>();

    const { data, isLoading: loadingSpeedCameras, error: errorSpeedCameras } = useQuery({
        queryKey: ["speedCameras", showSpeedCameras],
        queryFn: () => fetchSpeedCameras({
            userLonLat: params.userLonLat,
            distance: params.distance
        }),
        enabled: showSpeedCameras && !!params.userLonLat,
        refetchInterval: REFETCH_INTERVAL,
    });

    useEffect(() => {
        if (data && showSpeedCameras) {
            let closestCamera: SpeedCameraAlert | null = null;

            data?.features?.forEach((feature) => {
                const { lon, lat } = params.userLonLat;
                const cameraPoint = point([
                    feature.geometry.coordinates[0] as number,
                    feature.geometry.coordinates[1] as number,
                ]);
                const userPoint = point([lon, lat]);
                const distanceToCamera = distance(userPoint, cameraPoint, { units: "meters" });

                const isWithinWarningDistance = distanceToCamera <= SHOW_SPEED_CAMERA_WARNING_THRESHOLD_IN_METERS;
                const isCloserThanPrevious = !closestCamera || distanceToCamera < closestCamera.distance;

                if (isWithinWarningDistance && isCloserThanPrevious) {
                    closestCamera = { distance: distanceToCamera, feature };
                }
            });

            setSpeedCameras({ data, alert: closestCamera });
        } else {
            setSpeedCameras({ data: DEFAULT_FC, alert: null });
        }
    }, [data, params.userLonLat]);

    return { speedCameras, loadingSpeedCameras, errorSpeedCameras };
}