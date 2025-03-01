import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useMutation, useQuery } from "@tanstack/react-query";
import { distance, lineString, nearestPointOnLine, point } from "@turf/turf";

import { THRESHOLD } from "@/constants/env-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchDirections } from "@/services/navigation";
import { mapExcludeNavigationSelectors } from "@/store/mapExcludeNavigation";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapWaypointSelectors } from "@/store/mapWaypoint";
import { isValidLonLat } from "@/utils/map-utils";

const useNavigation = () => {
    const { userLocation } = useContext(UserLocationContext);
    const dispatch = useDispatch();
    const location = useSelector(mapNavigationSelectors.location);
    const navigationProfile = useSelector(mapNavigationSelectors.navigationProfile);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const directions = useSelector(mapNavigationSelectors.directions);
    const excludeTypes = useSelector(mapExcludeNavigationSelectors.excludeTypes);
    const gasStationWaypoint = useSelector(mapWaypointSelectors.gasStationWaypoints);
    const directNavigation = useSelector(mapNavigationSelectors.directNavigation);

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;

    const destinationLngLat = {
        lon: location?.coordinates.longitude,
        lat: location?.coordinates.latitude,
    };

    const {
        data,
        isLoading: loadingDirections,
        error: errorDirections,
    } = useQuery({
        queryKey: ["directions", location, gasStationWaypoint, excludeTypes],
        queryFn: () =>
            fetchDirections({
                profile: navigationProfile,
                startLngLat: { lon: longitude, lat: latitude },
                destinationLngLat,
                excludeTypes,
                waypoint: gasStationWaypoint ? { lon: gasStationWaypoint.lon, lat: gasStationWaypoint.lat } : undefined,
            }),
        enabled: isValidLonLat(longitude, latitude) && isValidLonLat(destinationLngLat.lon, destinationLngLat.lat),
    });

    const { mutate: recalculateRoute } = useMutation({
        mutationFn: () =>
            fetchDirections({
                profile: navigationProfile,
                startLngLat: { lon: longitude, lat: latitude },
                destinationLngLat: destinationLngLat,
                excludeTypes,
            }),
        onSuccess: (data) => {
            if (data?.routes?.length > 0) {
                dispatch(mapNavigationActions.setDirections(data.routes[0]));
            }
        },
        onError: (error) => {
            console.log(`Failed to recalculate route: ${error}`);
        },
    });

    useEffect(() => {
        if (data?.routes?.length > 0) {
            directNavigation
                ? dispatch(mapNavigationActions.setDirections(data.routes[0]))
                : dispatch(mapNavigationActions.setRouteOptions(data.routes));
        }
    }, [data]);

    useEffect(() => {
        if (directions && longitude && latitude && isNavigationMode) {
            const routeCoordinates = directions.geometry.coordinates;
            const userPoint = point([longitude, latitude]);

            const routeLine = lineString(routeCoordinates);
            const nearestPointFeature = nearestPointOnLine(routeLine, userPoint);

            const nearestPoint = point(nearestPointFeature.geometry.coordinates);
            const distanceToRoute = distance(userPoint, nearestPoint, { units: "meters" });

            if (distanceToRoute > THRESHOLD.NAVIGATION.ROUTE_DEVIATION_METERS) {
                recalculateRoute();
            }
        }
    }, [directions, longitude, latitude, isNavigationMode]);

    return { loadingDirections, errorDirections };
};

export default useNavigation;
