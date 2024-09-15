import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { point, distance } from "@turf/turf";
import { SHOW_INCIDENT_WARNING_THRESHOLD_IN_METERS } from "../constants/map-constants";
import { useSelector } from "react-redux";
import { mapIncidentSelectors } from "../store/mapIncident";
import { fetchIncidents } from "../services/incidents";
import { IncidentAlert, IncidentFc } from "../types/ITraffic";

export default function useIncidents(params: {
    userLon: number,
    userLat: number,
    distance: number;
}) {
    const showIncidents = useSelector(mapIncidentSelectors.showIncident);
    const [incidents, setIncidents] = useState<{ data: IncidentFc, alert: IncidentAlert | null; }>();

    const { data, isLoading: loadingIncidents, error: errorIncidents } = useQuery({
        queryKey: ["incidents", showIncidents],
        queryFn: () => fetchIncidents({
            userLon: params.userLon,
            userLat: params.userLat,
            distance: params.distance
        }),
        enabled: showIncidents && !!params.userLon && !!params.userLat,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (data && showIncidents) {
            let closestIncident: IncidentAlert | null = null;

            const filteredIncidents = data.incidents.filter((incident) => incident.properties.probabilityOfOccurrence === "certain");

            filteredIncidents?.forEach((incident) => {
                const incidentPoint = point(incident.geometry.coordinates[0]);
                const userPoint = point([params.userLon, params.userLat]);
                const distanceToIncident = distance(userPoint, incidentPoint, { units: "meters" });

                const isWithinWarningDistance = distanceToIncident <= SHOW_INCIDENT_WARNING_THRESHOLD_IN_METERS;
                const isCloserThanPrevious = !closestIncident || distanceToIncident < closestIncident.distance;

                if (isWithinWarningDistance && isCloserThanPrevious) {
                    closestIncident = { distance: distanceToIncident, events: incident.properties.events };
                }
            });

            setIncidents({ data: { ...data, incidents: filteredIncidents }, alert: closestIncident });
        } else {
            setIncidents({
                data: { type: "FeatureCollection", incidents: [] },
                alert: null
            });
        }
    }, [data, params.userLon, params.userLat]);

    return { incidents, loadingIncidents, errorIncidents };
}