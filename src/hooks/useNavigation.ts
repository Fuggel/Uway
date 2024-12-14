import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useMutation, useQuery } from "@tanstack/react-query";
import { distance, lineSlice, lineString, nearestPointOnLine, point } from "@turf/turf";

import { THRESHOLD } from "@/constants/env-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchDirections } from "@/services/navigation";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { isValidLonLat } from "@/utils/map-utils";

const useNavigation = () => {
    const { userLocation } = useContext(UserLocationContext);
    const dispatch = useDispatch();
    const location = useSelector(mapNavigationSelectors.location);
    const navigationProfile = useSelector(mapNavigationSelectors.navigationProfile);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const directions = useSelector(mapNavigationSelectors.directions);

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;

    const destinationLngLat = {
        lon: location?.lon,
        lat: location?.lat,
    };

    const {
        data,
        isLoading: loadingDirections,
        error: errorDirections,
    } = useQuery({
        queryKey: ["directions", navigationProfile, location],
        queryFn: () =>
            fetchDirections({
                profile: navigationProfile,
                startLngLat: { lon: longitude, lat: latitude },
                destinationLngLat,
            }),
        enabled: isValidLonLat(longitude, latitude) && isValidLonLat(destinationLngLat.lon, destinationLngLat.lat),
        staleTime: Infinity,
    });

    const { mutate: recalculateRoute } = useMutation({
        mutationFn: () =>
            fetchDirections({
                profile: navigationProfile,
                startLngLat: { lon: longitude, lat: latitude },
                destinationLngLat: destinationLngLat,
            }),
        onSuccess: (data) => {
            if (data?.routes?.length > 0) {
                dispatch(mapNavigationActions.setCurrentStep(0));
                dispatch(mapNavigationActions.setDirections(data.routes[0]));
            }
        },
        onError: (error) => {
            console.log(`Failed to recalculate route: ${error}`);
        },
    });

    const updateRemainingRoute = () => {
        if (directions && longitude && latitude) {
            const routeCoordinates = directions.geometry.coordinates;
            const userPoint = point([longitude, latitude]);
            const routeLine = lineString(routeCoordinates);

            const nearestPointFeature = nearestPointOnLine(routeLine, userPoint);

            if (nearestPointFeature && nearestPointFeature.geometry) {
                const nearestCoordinates = nearestPointFeature.geometry.coordinates;

                const remainingRoute = lineSlice(
                    point(nearestCoordinates),
                    point(routeCoordinates[routeCoordinates.length - 1]),
                    routeLine
                );

                dispatch(
                    mapNavigationActions.setDirections({
                        ...directions,
                        geometry: remainingRoute.geometry,
                    })
                );
            }
        }
    };

    useEffect(() => {
        if (data?.routes?.length > 0) {
            dispatch(mapNavigationActions.setDirections(data.routes[0]));
        }
    }, [data]);

    useEffect(() => {
        if (isNavigationMode) {
            updateRemainingRoute();
        }
    }, [longitude, latitude, isNavigationMode]);

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
