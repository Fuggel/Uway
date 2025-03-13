import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";
import { FeatureCollection, point } from "@turf/helpers";
import { distance } from "@turf/turf";

import { REFETCH_INTERVAL, THRESHOLD } from "@/constants/env-constants";
import { DEFAULT_FC } from "@/constants/map-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchIncidents } from "@/services/incidents";
import { mapIncidentSelectors } from "@/store/mapIncident";
import { mapNavigationSelectors } from "@/store/mapNavigation";
import { IncidentAlert, IncidentProperties, WarningAlertIncident } from "@/types/ITraffic";
import { convertSpeedToKmh, isFeatureRelevant, warningThresholds } from "@/utils/map-utils";
import { incidentTitle } from "@/utils/sheet-utils";

import useTextToSpeech from "./useTextToSpeech";

const useIncidents = () => {
    const { userLocation } = useContext(UserLocationContext);
    const showIncidents = useSelector(mapIncidentSelectors.showIncident);
    const playAcousticWarning = useSelector(mapIncidentSelectors.playAcousticWarning);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const directions = useSelector(mapNavigationSelectors.directions);
    const { startSpeech } = useTextToSpeech();
    const [incidents, setIncidents] = useState<{ data: FeatureCollection; alert: IncidentAlert | null }>();
    const [hasPlayedWarning, setHasPlayedWarning] = useState({ early: false, late: false });
    const [incidentWarningText, setIncidentWarningText] = useState<WarningAlertIncident | null>(null);

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;
    const heading = userLocation?.coords?.course || 0;
    const userSpeed = userLocation?.coords.speed || 0;
    const currentSpeed = userSpeed && userSpeed > 0 ? convertSpeedToKmh(userSpeed) : 0;

    const {
        data,
        isLoading: loadingIncidents,
        error: errorIncidents,
    } = useQuery({
        queryKey: ["incidents", showIncidents],
        queryFn: () =>
            fetchIncidents({
                userLonLat: { lon: longitude, lat: latitude },
            }),
        enabled: showIncidents && !!longitude && !!latitude,
        staleTime: Infinity,
        refetchInterval: REFETCH_INTERVAL.INCIDENTS_IN_MINUTES,
    });

    useEffect(() => {
        if (data && showIncidents && longitude && latitude) {
            const { early, late } = warningThresholds(currentSpeed);
            let closestIncident: IncidentAlert | null = null;
            let isWithinAnyWarningZone = false;

            const filteredIncidents = data.features?.filter(
                (incident) =>
                    (incident.properties as unknown as IncidentProperties).probabilityOfOccurrence === "certain"
            );

            filteredIncidents?.forEach((incident) => {
                const userPoint: [number, number] = [longitude, latitude];
                const incidentPoint = incident.geometry.coordinates[0] as [number, number];

                const distanceToFeature = distance(point(userPoint), point(incidentPoint), {
                    units: "meters",
                });

                if (distanceToFeature > early) {
                    return;
                }

                const { isRelevant } = isFeatureRelevant({
                    userPoint: [longitude, latitude],
                    featurePoint: incidentPoint,
                    heading,
                    tolerance: THRESHOLD.NAVIGATION.IS_AHEAD_IN_DEGREES,
                    laneThreshold: THRESHOLD.NAVIGATION.IS_ON_SAME_LANE_IN_DEGREES,
                    route: directions?.geometry?.coordinates,
                    routeBufferTolerance: THRESHOLD.NAVIGATION.ROUTE_BUFFER_TOLERANCE,
                });

                const isWithinEarlyWarningDistance = distanceToFeature <= early;
                const isWithinLateWarningDistance = distanceToFeature <= late;
                const isCloserThanPrevious = !closestIncident || distanceToFeature < closestIncident.distance;

                if (
                    isNavigationMode &&
                    isRelevant &&
                    (isWithinEarlyWarningDistance || isWithinLateWarningDistance) &&
                    isCloserThanPrevious
                ) {
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

                if (isNavigationMode && playAcousticWarning && isRelevant && incidentWarningText?.textToSpeech) {
                    if (!hasPlayedWarning.early && isWithinEarlyWarningDistance) {
                        startSpeech(incidentWarningText.textToSpeech);
                        setHasPlayedWarning((prev) => ({ ...prev, early: true }));
                    } else if (!hasPlayedWarning.late && isWithinLateWarningDistance) {
                        startSpeech(incidentWarningText.textToSpeech);
                        setHasPlayedWarning((prev) => ({ ...prev, late: true }));
                    }
                }
            });

            if (!isWithinAnyWarningZone) {
                setHasPlayedWarning({ early: false, late: false });
            }

            setIncidents({
                data: { ...data, features: filteredIncidents },
                alert: closestIncident,
            });
        } else {
            setIncidents({ data: DEFAULT_FC, alert: null });
            setHasPlayedWarning({ early: false, late: false });
        }
    }, [data, longitude, latitude, isNavigationMode]);

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
