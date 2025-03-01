import { useContext, useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { CameraRef } from "@rnmapbox/maps/lib/typescript/src/components/Camera";
import { Geometry, Position } from "@turf/helpers";

import { MAP_CONFIG } from "@/constants/map-constants";
import { MapFeatureContext } from "@/contexts/MapFeatureContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { mapLayoutsSelectors } from "@/store/mapLayouts";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapWaypointSelectors } from "@/store/mapWaypoint";
import { convertSpeedToKmh } from "@/utils/map-utils";

const { width, height } = Dimensions.get("window");

const useMapCamera = () => {
    const cameraRef = useRef<CameraRef | null>(null);
    const dispatch = useDispatch();
    const { userLocation } = useContext(UserLocationContext);
    const { gasStations } = useContext(MapFeatureContext);
    const routeOptions = useSelector(mapNavigationSelectors.routeOptions);
    const showRouteOptions = useSelector(mapNavigationSelectors.showRouteOptions);
    const selectedRoute = useSelector(mapNavigationSelectors.selectedRoute);
    const directions = useSelector(mapNavigationSelectors.directions);
    const tracking = useSelector(mapNavigationSelectors.tracking);
    const isNavigationSelecting = useSelector(mapNavigationSelectors.isNavigationSelecting);
    const navigationView = useSelector(mapNavigationSelectors.navigationView);
    const navigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const isGasStationWaypoint = useSelector(mapWaypointSelectors.gasStationWaypoints);
    const selectingGasStationWaypoint = useSelector(mapWaypointSelectors.selectGasStationWaypoint);
    const categoryLocations = useSelector(mapNavigationSelectors.categoryLocation);
    const isOpenCategoryList = useSelector(mapLayoutsSelectors.openCategoryLocationsList);
    const selectingCategoryLocation = useSelector(mapLayoutsSelectors.selectingCategoryLocation);
    const openGasStationsList = useSelector(mapLayoutsSelectors.openGasStationsList);

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

    const fitBoundsToUserAndSelectedRoute = () => {
        if (!cameraRef.current || !userLocation || !routeOptions) return;

        const userCoords: Position = [userLocation!.coords.longitude, userLocation!.coords.latitude];
        const routeCoords = routeOptions[selectedRoute].geometry.coordinates;
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

    const fitBoundsToUserAndGasStations = () => {
        if (!cameraRef.current || !userLocation || !gasStations?.gasStations?.features) return;

        const userCoords: Position = [userLocation.coords.longitude, userLocation.coords.latitude];

        const gasStationCoords = gasStations.gasStations.features.map((gasStation) => {
            const geometry = gasStation.geometry as Geometry;
            return geometry.coordinates;
        }) as Position[];

        const allCoords: Position[] = [userCoords, ...gasStationCoords];

        const lons = allCoords.map(([lon]) => lon);
        const lats = allCoords.map(([, lat]) => lat);

        const ne: Position = [Math.max(...lons), Math.max(...lats)];
        const sw: Position = [Math.min(...lons), Math.min(...lats)];

        const WAYPOINT_OFFSET_HORIZONTAL = 0.15;
        const WAYPOINT_OFFSET_BOTTOM = 0.35;

        cameraRef.current.fitBounds(
            ne,
            sw,
            [
                0,
                width * MAP_CONFIG.boundsOffset * WAYPOINT_OFFSET_HORIZONTAL,
                height * WAYPOINT_OFFSET_BOTTOM,
                width * MAP_CONFIG.boundsOffset * WAYPOINT_OFFSET_HORIZONTAL,
            ],
            MAP_CONFIG.animationDuration
        );
    };

    const fitBoundsToUserAndPois = () => {
        if (!cameraRef.current || !userLocation || !categoryLocations?.features) return;

        const userCoords: Position = [userLocation.coords.longitude, userLocation.coords.latitude];

        const poiCoords = categoryLocations.features.map((poi) => {
            const geometry = poi.geometry as Geometry;
            return geometry.coordinates;
        }) as Position[];

        const allCoords: Position[] = [userCoords, ...poiCoords];

        const lons = allCoords.map(([lon]) => lon);
        const lats = allCoords.map(([, lat]) => lat);

        const ne: Position = [Math.max(...lons), Math.max(...lats)];
        const sw: Position = [Math.min(...lons), Math.min(...lats)];

        const POI_OFFSET_HORIZONTAL = 0.35;
        const POI_OFFSET_BOTTOM = 0.4;

        cameraRef.current.fitBounds(
            ne,
            sw,
            [
                0,
                width * MAP_CONFIG.boundsOffset * POI_OFFSET_HORIZONTAL,
                height * (isOpenCategoryList ? POI_OFFSET_BOTTOM : 0),
                width * MAP_CONFIG.boundsOffset * POI_OFFSET_HORIZONTAL,
            ],
            MAP_CONFIG.animationDuration
        );
    };

    useEffect(() => {
        if (
            isNavigationSelecting &&
            directions &&
            tracking &&
            !selectingGasStationWaypoint &&
            !selectingCategoryLocation &&
            !openGasStationsList
        ) {
            fitBounds();
        }
    }, [
        isNavigationSelecting,
        directions,
        tracking,
        isGasStationWaypoint,
        selectingGasStationWaypoint,
        selectingCategoryLocation,
        openGasStationsList,
    ]);

    useEffect(() => {
        if ((selectingGasStationWaypoint || openGasStationsList) && tracking) {
            fitBoundsToUserAndGasStations();
        }
    }, [selectingGasStationWaypoint, openGasStationsList, tracking]);

    useEffect(() => {
        if (selectingCategoryLocation && tracking) {
            fitBoundsToUserAndPois();
        }
    }, [selectingCategoryLocation, isOpenCategoryList, categoryLocations, tracking]);

    useEffect(() => {
        if (showRouteOptions && routeOptions && tracking) {
            fitBoundsToUserAndSelectedRoute();
        }
    }, [showRouteOptions, selectedRoute, routeOptions, tracking]);

    useEffect(() => {
        const updateCamera = () => {
            if (
                !cameraRef.current ||
                selectingGasStationWaypoint ||
                selectingCategoryLocation ||
                openGasStationsList ||
                showRouteOptions
            ) {
                return;
            }

            cameraRef.current.setCamera({
                animationMode: "flyTo",
                animationDuration: MAP_CONFIG.animationDuration,
                centerCoordinate:
                    tracking && userLocation
                        ? [userLocation.coords.longitude, userLocation.coords.latitude]
                        : undefined,
                zoomLevel:
                    currentSpeed && tracking
                        ? MAP_CONFIG.zoom - 0.01 * currentSpeed
                        : tracking
                          ? MAP_CONFIG.zoom
                          : undefined,
                pitch: navigationView ? MAP_CONFIG.followPitch : MAP_CONFIG.pitch,
                heading: tracking ? userLocation?.coords.course : undefined,
                padding: navigationView ? MAP_CONFIG.followPadding : MAP_CONFIG.padding,
            });
        };

        if (!isNavigationSelecting && tracking) {
            updateCamera();
        }
    }, [
        tracking,
        isNavigationSelecting,
        userLocation?.coords.longitude,
        userLocation?.coords.latitude,
        navigationView,
        showRouteOptions,
        openGasStationsList,
        selectingGasStationWaypoint,
    ]);

    useEffect(() => {
        if (tracking && navigationMode && !navigationView) {
            dispatch(mapNavigationActions.setNavigationView(true));
        }
    }, [tracking, navigationMode, navigationView]);

    return { cameraRef };
};

export default useMapCamera;
