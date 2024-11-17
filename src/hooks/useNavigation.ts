import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useMutation, useQuery } from "@tanstack/react-query";
import { lineString, point } from "@turf/helpers";
import { distance, nearestPointOnLine } from "@turf/turf";

import { THRESHOLD } from "@/constants/env-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchDirections } from "@/services/navigation";
import { mapNavigationSelectors } from "@/store/mapNavigation";
import { LonLat } from "@/types/IMap";
import { Direction } from "@/types/INavigation";
import { isValidLonLat } from "@/utils/map-utils";

const useNavigation = (params: {
    destinationLngLat: LonLat;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const { userLocation } = useContext(UserLocationContext);
    const navigationProfile = useSelector(mapNavigationSelectors.navigationProfile);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const [directions, setDirections] = useState<Direction | null>(null);
    const locations = useSelector(mapNavigationSelectors.location);

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;

    const {
        data,
        isLoading: loadingDirections,
        error: errorDirections,
    } = useQuery({
        queryKey: ["directions", navigationProfile, locations],
        queryFn: () =>
            fetchDirections({
                profile: navigationProfile,
                startLngLat: { lon: longitude, lat: latitude },
                destinationLngLat: params.destinationLngLat,
            }),
        enabled:
            isValidLonLat(longitude, latitude) &&
            isValidLonLat(params.destinationLngLat.lon, params.destinationLngLat.lat),
        staleTime: Infinity,
    });

    const { mutate: recalculateRoute } = useMutation({
        mutationFn: () =>
            fetchDirections({
                profile: navigationProfile,
                startLngLat: { lon: longitude, lat: latitude },
                destinationLngLat: params.destinationLngLat,
            }),
        onSuccess: (data) => {
            if (data?.routes?.length > 0) {
                setDirections(null);
                params.setCurrentStep(0);
                setDirections(data.routes[0]);
            }
        },
        onError: (error) => {
            console.log(`Failed to recalculate route: ${error}`);
        },
    });

    useEffect(() => {
        if (directions && longitude && latitude && isNavigationMode) {
            const routeCoordinates = directions.geometry.coordinates;
            const userPoint = point([longitude, latitude]);

            const routeLine = lineString(routeCoordinates);
            const nearestPointFeature = nearestPointOnLine(routeLine, userPoint);

            const nearestPoint = point(nearestPointFeature.geometry.coordinates);

            const distanceToRoute = distance(userPoint, nearestPoint, {
                units: "meters",
            });

            if (distanceToRoute > THRESHOLD.NAVIGATION.ROUTE_DEVIATION_METERS) {
                recalculateRoute();
            }
        }
    }, [directions, longitude, latitude, isNavigationMode]);

    useEffect(() => {
        if (data?.routes?.length > 0) {
            setDirections(data.routes[0]);
        }
    }, [data]);

    return { directions, setDirections, loadingDirections, errorDirections };
};

export default useNavigation;
