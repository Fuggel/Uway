import { useContext, useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { CameraRef } from "@rnmapbox/maps/lib/typescript/src/components/Camera";
import { Position } from "@turf/helpers";

import { MAP_CONFIG } from "@/constants/map-constants";
import { MapNavigationContext } from "@/contexts/MapNavigationContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";

const { width, height } = Dimensions.get("window");

const useMapCamera = () => {
    const cameraRef = useRef<CameraRef | null>(null);
    const dispatch = useDispatch();
    const { userLocation } = useContext(UserLocationContext);
    const { directions } = useContext(MapNavigationContext);
    const tracking = useSelector(mapNavigationSelectors.tracking);
    const location = useSelector(mapNavigationSelectors.location);
    const navigationView = useSelector(mapNavigationSelectors.navigationView);
    const navigationMode = useSelector(mapNavigationSelectors.isNavigationMode);

    const fitBounds = () => {
        const userCoords: Position = [userLocation!.coords.longitude, userLocation!.coords.latitude];
        const routeCoords = directions!.geometry.coordinates;
        const allCoords: Position[] = [userCoords, ...routeCoords];

        const lons = allCoords.map(([lon]) => lon);
        const lats = allCoords.map(([, lat]) => lat);

        const ne: Position = [Math.max(...lons), Math.max(...lats)];
        const sw: Position = [Math.min(...lons), Math.min(...lats)];

        cameraRef.current!.fitBounds(
            ne,
            sw,
            [
                height * MAP_CONFIG.boundsOffset,
                width * MAP_CONFIG.boundsOffset,
                height * MAP_CONFIG.boundsOffset,
                width * MAP_CONFIG.boundsOffset,
            ],
            MAP_CONFIG.boundsAnimationDuration
        );
    };

    useEffect(() => {
        if (!cameraRef.current || !userLocation) return;

        if (tracking && location && !navigationMode && directions) {
            fitBounds();
            return;
        }

        cameraRef.current.setCamera({
            animationMode: "linearTo",
            animationDuration: MAP_CONFIG.animationDuration,
            centerCoordinate:
                userLocation && (tracking || navigationView)
                    ? ([userLocation.coords.longitude, userLocation.coords.latitude] as Position)
                    : tracking && !userLocation
                      ? ([MAP_CONFIG.position.lon, MAP_CONFIG.position.lat] as Position)
                      : undefined,
            zoomLevel: !userLocation
                ? MAP_CONFIG.noLocationZoom
                : tracking || navigationView
                  ? MAP_CONFIG.zoom
                  : undefined,
            pitch: navigationView ? MAP_CONFIG.followPitch : MAP_CONFIG.pitch,
            heading: tracking || navigationView ? userLocation?.coords.heading : undefined,
            padding: navigationView ? MAP_CONFIG.followPadding : MAP_CONFIG.padding,
        });
    }, [location, directions, navigationMode, navigationView, tracking, userLocation]);

    useEffect(() => {
        if (tracking && navigationMode && !navigationView) {
            dispatch(mapNavigationActions.setNavigationView(true));
        }
    }, [tracking, navigationMode, navigationView]);

    return { cameraRef };
};

export default useMapCamera;
