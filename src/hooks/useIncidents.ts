import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "@turf/helpers";
import { bearing, distance, point } from "@turf/turf";

import {
    DEFAULT_FC,
    IS_ON_SAME_LANE_INCIDENTS_THRESHOLD_IN_DEGREES,
    PLAY_ACOUSTIC_WARNING_INCIDENT_THRESHOLD_IN_METERS,
    SHOW_INCIDENTS_THRESHOLD_IN_METERS,
    SHOW_INCIDENT_WARNING_THRESHOLD_IN_METERS,
} from "@/constants/map-constants";
import { INCIDENTS_REFETCH_INTERVAL } from "@/constants/time-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchIncidents } from "@/services/incidents";
import { mapIncidentSelectors } from "@/store/mapIncident";
import { IncidentAlert, IncidentProperties, WarningAlertIncident } from "@/types/ITraffic";
import { incidentTitle } from "@/utils/sheet-utils";

import useTextToSpeech from "./useTextToSpeech";

const useIncidents = () => {
    const { userLocation } = useContext(UserLocationContext);
    const showIncidents = useSelector(mapIncidentSelectors.showIncident);
    const playAcousticWarning = useSelector(mapIncidentSelectors.playAcousticWarning);
    const showWarningThresholdInMeters =
        useSelector(mapIncidentSelectors.showWarningThresholdInMeters) || SHOW_INCIDENT_WARNING_THRESHOLD_IN_METERS;
    const playAcousticWarningThresholdInMeters =
        useSelector(mapIncidentSelectors.playAcousticWarningThresholdInMeters) ||
        PLAY_ACOUSTIC_WARNING_INCIDENT_THRESHOLD_IN_METERS;
    const { startSpeech } = useTextToSpeech();
    const [incidents, setIncidents] = useState<{ data: FeatureCollection; alert: IncidentAlert | null }>();
    const [hasPlayedWarning, setHasPlayedWarning] = useState(false);
    const [incidentWarningText, setIncidentWarningText] = useState<WarningAlertIncident | null>(null);

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;
    const heading = userLocation?.coords?.heading || 0;

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

            const filteredIncidents = data.features.filter(
                (incident) =>
                    (incident.properties as unknown as IncidentProperties).probabilityOfOccurrence === "certain"
            );

            filteredIncidents?.forEach((incident) => {
                const incidentPoint = point(incident.geometry.coordinates[0] as [number, number]);
                const userPoint = point([longitude, latitude]);
                const distanceToIncident = distance(userPoint, incidentPoint, { units: "meters" });

                const bearingToIncident = bearing(userPoint, incidentPoint);
                const isSameLane =
                    Math.abs(heading - bearingToIncident) < IS_ON_SAME_LANE_INCIDENTS_THRESHOLD_IN_DEGREES ||
                    Math.abs(heading - bearingToIncident) > 360 - IS_ON_SAME_LANE_INCIDENTS_THRESHOLD_IN_DEGREES;

                const isWithinWarningDistance = distanceToIncident <= showWarningThresholdInMeters;
                const isWithinAcousticWarningDistance = distanceToIncident <= playAcousticWarningThresholdInMeters;
                const isCloserThanPrevious = !closestIncident || distanceToIncident < closestIncident.distance;

                if (isSameLane && isWithinWarningDistance && isCloserThanPrevious) {
                    isWithinAnyWarningZone = true;
                    closestIncident = {
                        distance: distanceToIncident,
                        events: (incident.properties as unknown as IncidentProperties).events,
                    };

                    setIncidentWarningText({
                        ...incidentWarningText,
                        properties: incident.properties as unknown as IncidentProperties,
                    });
                }

                if (
                    playAcousticWarning &&
                    isWithinAcousticWarningDistance &&
                    !hasPlayedWarning &&
                    incidentWarningText?.textToSpeech &&
                    isSameLane
                ) {
                    startSpeech(incidentWarningText?.textToSpeech);
                    setHasPlayedWarning(true);
                }
            });

            if (!isWithinAnyWarningZone) {
                setHasPlayedWarning(false);
            }

            setIncidents({
                data: { ...data, features: filteredIncidents },
                alert: closestIncident,
            });
        } else {
            setIncidents({
                data: DEFAULT_FC,
                alert: null,
            });
            setHasPlayedWarning(false);
        }
    }, [
        data,
        longitude,
        latitude,
        hasPlayedWarning,
        playAcousticWarningThresholdInMeters,
        showWarningThresholdInMeters,
    ]);

    useEffect(() => {
        if (incidents?.alert) {
            const distance = incidents.alert.distance.toFixed(0);

            setIncidentWarningText({
                textToSpeech: `${incidentTitle(incidentWarningText?.properties)} in ${distance} Metern.`,
                title: `${incidentTitle(incidentWarningText?.properties)} in ${distance} m.`,
            });
        }
    }, [incidents?.alert]);

    return { incidents, incidentWarningText, loadingIncidents, errorIncidents };
};

export default useIncidents;
