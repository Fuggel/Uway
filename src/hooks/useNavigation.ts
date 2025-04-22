import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useMutation, useQuery } from "@tanstack/react-query";
import { bearing, distance, lineString, nearestPointOnLine, point } from "@turf/turf";

import { THRESHOLD } from "@/constants/env-constants";
import { AuthContext } from "@/contexts/AuthContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchDirections } from "@/services/navigation";
import { mapExcludeNavigationSelectors } from "@/store/mapExcludeNavigation";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { isValidLonLat, removeConsecutiveDuplicates } from "@/utils/map-utils";

const useNavigation = () => {
    const { authToken } = useContext(AuthContext);
    const { userLocation } = useContext(UserLocationContext);
    const dispatch = useDispatch();
    const location = useSelector(mapNavigationSelectors.location);
    const navigationProfile = useSelector(mapNavigationSelectors.navigationProfile);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const directions = useSelector(mapNavigationSelectors.directions);
    const excludeTypes = useSelector(mapExcludeNavigationSelectors.excludeTypes);
    const directNavigation = useSelector(mapNavigationSelectors.directNavigation);

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;
    const heading = userLocation?.coords?.course;

    const destinationLngLat = {
        lon: location?.coordinates.longitude,
        lat: location?.coordinates.latitude,
    };

    const {
        data,
        isLoading: loadingDirections,
        error: errorDirections,
    } = useQuery({
        queryKey: ["directions", location, excludeTypes],
        queryFn: () =>
            fetchDirections({
                authToken: String(authToken?.token),
                profile: navigationProfile,
                startLngLat: { lon: longitude, lat: latitude },
                destinationLngLat,
                excludeTypes,
            }),
        enabled:
            isValidLonLat(longitude, latitude) &&
            isValidLonLat(destinationLngLat.lon, destinationLngLat.lat) &&
            !!authToken?.token,
    });

    const { mutate: recalculateRoute } = useMutation({
        mutationFn: () =>
            fetchDirections({
                authToken: String(authToken?.token),
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
            console.log("Triggered...");
            directNavigation
                ? dispatch(mapNavigationActions.setDirections(data.routes[0]))
                : dispatch(mapNavigationActions.setRouteOptions(data.routes));
        }
    }, [data]);

    useEffect(() => {
        if (directions && longitude && latitude && isNavigationMode) {
            const routeCoordinates = directions.geometry.coordinates;
            const userPoint = point([longitude, latitude]);

            const cleanRouteLine = removeConsecutiveDuplicates(routeCoordinates);
            const routeLine = lineString(cleanRouteLine);

            const nearestPointFeature = nearestPointOnLine(routeLine, userPoint);

            const nearestPoint = point(nearestPointFeature.geometry.coordinates);
            const distanceToRoute = distance(userPoint, nearestPoint, { units: "meters" });

            const nearestIndex = nearestPointFeature.properties.index;
            if (nearestIndex === undefined || nearestIndex >= routeCoordinates.length - 1) return;

            const nextRoutePoint = routeCoordinates[nearestIndex + 1];
            const routeHeading = bearing(nearestPoint.geometry.coordinates, nextRoutePoint);

            const headingDifference = heading ? Math.abs(heading - routeHeading) : null;
            const isUTurn =
                headingDifference &&
                headingDifference > THRESHOLD.NAVIGATION.UTURN_ANGLE_MIN &&
                headingDifference < THRESHOLD.NAVIGATION.UTURN_ANGLE_MAX;

            if (distanceToRoute > THRESHOLD.NAVIGATION.ROUTE_DEVIATION_METERS || isUTurn) {
                recalculateRoute();
            }
        }
    }, [directions, longitude, latitude, isNavigationMode]);

    return { loadingDirections, errorDirections };
};

export default useNavigation;
