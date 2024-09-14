import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchDirections } from "../services/navigation";
import { LonLat } from "../types/IMap";
import { useEffect, useState } from "react";
import { incidentsToFeatureCollection, isValidLonLat } from "../utils/map-utils";
import { Direction, Incident } from "../types/INavigation";
import { ROUTE_DEVIATION_THRESHOLD_IN_METERS } from "../constants/map-constants";
import { FeatureCollection, lineString, Point, point } from "@turf/helpers";
import { distance, nearestPointOnLine } from "@turf/turf";

export default function useDirections(params: {
    profile: string;
    startLngLat: LonLat;
    destinationLngLat: LonLat;
    isNavigationMode: boolean;
    userLocation: LonLat;
}) {
    const [directions, setDirections] = useState<Direction | null>(null);
    const [incidents, setIncidents] = useState<FeatureCollection<Point> | null>(null);

    const { data, isLoading: loadingDirections, error: errorDirections } = useQuery({
        queryKey: ["directions", directions, params.profile, params.isNavigationMode],
        queryFn: () => fetchDirections({
            profile: params.profile,
            startLngLat: params.startLngLat,
            destinationLngLat: params.destinationLngLat
        }),
        enabled:
            params.isNavigationMode &&
            isValidLonLat(params.startLngLat.lon, params.startLngLat.lat) &&
            isValidLonLat(params.destinationLngLat.lon, params.destinationLngLat.lat),
        staleTime: Infinity,
    });

    const { mutate: recalculateRoute } = useMutation({
        mutationFn: () => fetchDirections({
            profile: params.profile,
            startLngLat: params.userLocation,
            destinationLngLat: params.destinationLngLat
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
        if (directions && params.userLocation) {
            const routeCoordinates = directions.geometry.coordinates;
            const userPoint = point([params.userLocation.lon, params.userLocation.lat]);

            const routeLine = lineString(routeCoordinates);
            const nearestPointFeature = nearestPointOnLine(routeLine, userPoint);

            const nearestPoint = point(nearestPointFeature.geometry.coordinates);

            const distanceToRoute = distance(userPoint, nearestPoint, { units: "meters" });

            if (distanceToRoute > ROUTE_DEVIATION_THRESHOLD_IN_METERS) {
                recalculateRoute();
            }
        }
    }, [directions, params.userLocation]);

    useEffect(() => {
        if (data?.routes?.length > 0) {
            const route = data.routes[0];

            setDirections(route);

            const allIncidents: FeatureCollection<Point> = {
                type: "FeatureCollection",
                features: [],
            };

            route.legs.forEach((leg: { incidents: Incident[]; }) => {
                if (leg.incidents && leg.incidents.length > 0) {
                    const incidentFc = incidentsToFeatureCollection(leg.incidents);
                    allIncidents.features.push(...incidentFc.features);
                }
            });

            setIncidents(allIncidents);
        }
    }, [data, params.isNavigationMode, params.profile]);

    return { directions, setDirections, incidents, loadingDirections, errorDirections };
}