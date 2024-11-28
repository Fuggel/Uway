import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";
import { FeatureCollection, point } from "@turf/helpers";
import { distance } from "@turf/turf";

import { REFETCH_INTERVAL, THRESHOLD } from "@/constants/env-constants";
import { DEFAULT_FC } from "@/constants/map-constants";
import { MapNavigationContext } from "@/contexts/MapNavigationContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchIncidents } from "@/services/incidents";
import { mapIncidentSelectors } from "@/store/mapIncident";
import { mapNavigationSelectors } from "@/store/mapNavigation";
import { IncidentAlert, IncidentProperties, WarningAlertIncident } from "@/types/ITraffic";
import { isFeatureRelevant } from "@/utils/map-utils";
import { incidentTitle } from "@/utils/sheet-utils";

import useTextToSpeech from "./useTextToSpeech";

const useIncidents = () => {
    const { userLocation } = useContext(UserLocationContext);
    const showIncidents = useSelector(mapIncidentSelectors.showIncident);
    const playAcousticWarning = useSelector(mapIncidentSelectors.playAcousticWarning);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const { directions } = useContext(MapNavigationContext);
    const showWarningThresholdInMeters =
        useSelector(mapIncidentSelectors.showWarningThresholdInMeters) || THRESHOLD.INCIDENT.SHOW_WARNING_IN_METERS;
    const playAcousticWarningThresholdInMeters =
        useSelector(mapIncidentSelectors.playAcousticWarningThresholdInMeters) ||
        THRESHOLD.INCIDENT.PLAY_ACOUSTIC_WARNING_IN_METERS;
    const { startSpeech } = useTextToSpeech();
    const [incidents, setIncidents] = useState<{ data: FeatureCollection; alert: IncidentAlert | null }>();
    const [hasPlayedWarning, setHasPlayedWarning] = useState(false);
    const [incidentWarningText, setIncidentWarningText] = useState<WarningAlertIncident | null>(null);

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;
    const heading = userLocation?.coords?.course || 0;

    const {
        data,
        isLoading: loadingIncidents,
        error: errorIncidents,
    } = useQuery({
        queryKey: ["incidents", showIncidents],
        queryFn: () =>
            fetchIncidents({
                userLonLat: { lon: longitude, lat: latitude },
                distance: THRESHOLD.INCIDENT.SHOW_IN_METERS,
            }),
        enabled: showIncidents && !!longitude && !!latitude,
        staleTime: Infinity,
        refetchInterval: REFETCH_INTERVAL.INCIDENTS_IN_MINUTES,
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
                const userPoint: [number, number] = [longitude, latitude];
                const incidentPoint = incident.geometry.coordinates[0] as [number, number];

                const distanceToFeature = distance(point(userPoint), point(incidentPoint), {
                    units: "meters",
                });

                if (distanceToFeature > showWarningThresholdInMeters) {
                    return;
                }

                const { isRelevant } = isFeatureRelevant({
                    userPoint: [longitude, latitude],
                    featurePoint: incidentPoint,
                    heading,
                    tolerance: THRESHOLD.INCIDENT.IS_AHEAD_IN_DEGREES,
                    laneThreshold: THRESHOLD.INCIDENT.IS_ON_SAME_LANE_IN_DEGREES,
                    route: directions?.geometry?.coordinates,
                    routeBufferTolerance: THRESHOLD.INCIDENT.ROUTE_BUFFER_TOLERANCE,
                });

                const isWithinWarningDistance = distanceToFeature <= showWarningThresholdInMeters;
                const isWithinAcousticWarningDistance = distanceToFeature <= playAcousticWarningThresholdInMeters;
                const isCloserThanPrevious = !closestIncident || distanceToFeature < closestIncident.distance;

                if (isNavigationMode && isRelevant && isWithinWarningDistance && isCloserThanPrevious) {
                    isWithinAnyWarningZone = true;
                    closestIncident = {
                        distance: distanceToFeature,
                        events: (incident.properties as unknown as IncidentProperties).events,
                    };

                    setIncidentWarningText({
                        ...incidentWarningText,
                        properties: incident.properties as unknown as IncidentProperties,
                    });
                }

                if (
                    isNavigationMode &&
                    playAcousticWarning &&
                    isWithinAcousticWarningDistance &&
                    !hasPlayedWarning &&
                    incidentWarningText?.textToSpeech &&
                    isRelevant
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
        isNavigationMode,
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
