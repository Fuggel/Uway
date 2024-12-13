import { useContext, useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { CameraRef } from "@rnmapbox/maps/lib/typescript/src/components/Camera";
import { Position } from "@turf/helpers";

import { MAP_CONFIG } from "@/constants/map-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { convertSpeedToKmh } from "@/utils/map-utils";

const { width, height } = Dimensions.get("window");

const useMapCamera = () => {
    const cameraRef = useRef<CameraRef | null>(null);
    const dispatch = useDispatch();
    const { userLocation } = useContext(UserLocationContext);
    const directions = useSelector(mapNavigationSelectors.directions);
    const tracking = useSelector(mapNavigationSelectors.tracking);
    const location = useSelector(mapNavigationSelectors.location);
    const navigationView = useSelector(mapNavigationSelectors.navigationView);
    const navigationMode = useSelector(mapNavigationSelectors.isNavigationMode);

    const userSpeed = userLocation?.coords.speed || 0;
    const currentSpeed = convertSpeedToKmh(userSpeed);

    const fitBounds = () => {
        if (!cameraRef.current || !userLocation) return;

        const userCoords: Position = [userLocation!.coords.longitude, userLocation!.coords.latitude];
        const routeCoords = directions!.geometry.coordinates;
        const allCoords: Position[] = [userCoords, ...routeCoords];

        const lons = allCoords.map(([lon]) => lon);
        const lats = allCoords.map(([, lat]) => lat);

        const ne: Position = [Math.max(...lons), Math.max(...lats)];
        const sw: Position = [Math.min(...lons), Math.min(...lats)];

        cameraRef.current.fitBounds(
            ne,
            sw,
            [
                height * MAP_CONFIG.boundsOffset,
                width * MAP_CONFIG.boundsOffset,
                height * MAP_CONFIG.boundsOffset,
                width * MAP_CONFIG.boundsOffset,
            ],
            MAP_CONFIG.animationDuration
        );
    };

    useEffect(() => {
        if (tracking && location && !navigationMode && directions) {
            fitBounds();
            return;
        }
    }, [location, directions, navigationMode, tracking]);

    useEffect(() => {
        if (!cameraRef.current) return;

        cameraRef.current.setCamera({
            animationMode: "flyTo",
            animationDuration: MAP_CONFIG.animationDuration,
            centerCoordinate:
                tracking && userLocation ? [userLocation.coords.longitude, userLocation.coords.latitude] : undefined,
            zoomLevel: currentSpeed && tracking ? MAP_CONFIG.zoom - 0.01 * currentSpeed : undefined,
            pitch: navigationView ? MAP_CONFIG.followPitch : MAP_CONFIG.pitch,
            heading: tracking ? userLocation?.coords.course : undefined,
            padding: navigationView ? MAP_CONFIG.followPadding : MAP_CONFIG.padding,
        });
    }, [tracking, userLocation?.coords.longitude, userLocation?.coords.latitude, navigationView]);

    useEffect(() => {
        if (tracking && navigationMode && !navigationView) {
            dispatch(mapNavigationActions.setNavigationView(true));
        }
    }, [tracking, navigationMode, navigationView]);

    return { cameraRef };
};

export default useMapCamera;
