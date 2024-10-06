import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchDirections } from "../services/navigation";
import { LonLat } from "../types/IMap";
import { useContext, useEffect, useState } from "react";
import { isValidLonLat } from "../utils/map-utils";
import { Direction } from "../types/INavigation";
import { ROUTE_DEVIATION_THRESHOLD_IN_METERS } from "../constants/map-constants";
import { lineString, point } from "@turf/helpers";
import { distance, nearestPointOnLine } from "@turf/turf";
import { useSelector } from "react-redux";
import { mapNavigationSelectors } from "../store/mapNavigation";
import { UserLocationContext } from "../contexts/UserLocationContext";

export default function useDirections(params: { destinationLngLat: LonLat }) {
    const { userLocation } = useContext(UserLocationContext);
    const navigationProfile = useSelector(mapNavigationSelectors.navigationProfile);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const [directions, setDirections] = useState<Direction | null>(null);

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;

    const {
        data,
        isLoading: loadingDirections,
        error: errorDirections,
    } = useQuery({
        queryKey: ["directions", directions, navigationProfile, isNavigationMode],
        queryFn: () =>
            fetchDirections({
                profile: navigationProfile,
                startLngLat: { lon: longitude, lat: latitude },
                destinationLngLat: params.destinationLngLat,
            }),
        enabled:
            isNavigationMode &&
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
                setDirections(data.routes[0]);
            }
        },
        onError: (error) => {
            console.log(`Failed to recalculate route: ${error}`);
        },
    });

    useEffect(() => {
        if (directions && longitude && latitude) {
            const routeCoordinates = directions.geometry.coordinates;
            const userPoint = point([longitude, latitude]);

            const routeLine = lineString(routeCoordinates);
            const nearestPointFeature = nearestPointOnLine(routeLine, userPoint);

            const nearestPoint = point(nearestPointFeature.geometry.coordinates);

            const distanceToRoute = distance(userPoint, nearestPoint, {
                units: "meters",
            });

            if (distanceToRoute > ROUTE_DEVIATION_THRESHOLD_IN_METERS) {
                recalculateRoute();
            }
        }
    }, [directions, longitude, latitude]);

    useEffect(() => {
        if (data?.routes?.length > 0 && longitude && latitude) {
            setDirections(data.routes[0]);
        }
    }, [data, isNavigationMode, navigationProfile]);

    return { directions, setDirections, loadingDirections, errorDirections };
}
