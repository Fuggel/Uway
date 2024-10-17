import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";
import { distance, point } from "@turf/turf";

import {
    SHOW_INCIDENTS_THRESHOLD_IN_METERS,
    SHOW_INCIDENT_WARNING_THRESHOLD_IN_METERS,
} from "@/constants/map-constants";
import { INCIDENTS_REFETCH_INTERVAL } from "@/constants/time-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchIncidents } from "@/services/incidents";
import { mapIncidentSelectors } from "@/store/mapIncident";
import { IncidentAlert, IncidentFc } from "@/types/ITraffic";

import useAlert from "./useAlert";

const useIncidents = () => {
    const { userLocation } = useContext(UserLocationContext);
    const showIncidents = useSelector(mapIncidentSelectors.showIncident);
    const { playSound } = useAlert();
    const [incidents, setIncidents] = useState<{ data: IncidentFc; alert: IncidentAlert | null }>();
    const [hasPlayedWarning, setHasPlayedWarning] = useState(false);

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;

    const {
        data,
        isLoading: loadingIncidents,
        error: errorIncidents,
    } = useQuery({
        queryKey: ["incidents", showIncidents],
        queryFn: () =>
            fetchIncidents({
                userLonLat: { lon: longitude, lat: latitude },
                distance: SHOW_INCIDENTS_THRESHOLD_IN_METERS,
            }),
        enabled: showIncidents && !!longitude && !!latitude,
        staleTime: Infinity,
        refetchInterval: INCIDENTS_REFETCH_INTERVAL,
    });

    useEffect(() => {
        if (data && showIncidents && longitude && latitude) {
            let closestIncident: IncidentAlert | null = null;
            let isWithinAnyWarningZone = false;

            const filteredIncidents = data.incidents.filter(
                (incident) => incident.properties.probabilityOfOccurrence === "certain"
            );

            filteredIncidents?.forEach((incident) => {
                const incidentPoint = point(incident.geometry.coordinates[0]);
                const userPoint = point([longitude, latitude]);
                const distanceToIncident = distance(userPoint, incidentPoint, {
                    units: "meters",
                });

                const isWithinWarningDistance = distanceToIncident <= SHOW_INCIDENT_WARNING_THRESHOLD_IN_METERS;
                const isCloserThanPrevious = !closestIncident || distanceToIncident < closestIncident.distance;

                if (isWithinWarningDistance && isCloserThanPrevious) {
                    closestIncident = {
                        distance: distanceToIncident,
                        events: incident.properties.events,
                    };

                    isWithinAnyWarningZone = true;

                    if (!hasPlayedWarning) {
                        playSound();
                        setHasPlayedWarning(true);
                    }
                }
            });

            if (!isWithinAnyWarningZone) {
                setHasPlayedWarning(false);
            }

            setIncidents({
                data: { ...data, incidents: filteredIncidents },
                alert: closestIncident,
            });
        } else {
            setIncidents({
                data: { type: "FeatureCollection", incidents: [] },
                alert: null,
            });
            setHasPlayedWarning(false);
        }
    }, [data, longitude, latitude, hasPlayedWarning]);

    return { incidents, loadingIncidents, errorIncidents };
};

export default useIncidents;
