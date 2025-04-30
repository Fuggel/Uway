import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "@turf/helpers";

import { REFETCH_INTERVAL } from "@/constants/env-constants";
import { DEFAULT_FC } from "@/constants/map-constants";
import { AuthContext } from "@/contexts/AuthContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchIncidents } from "@/services/incidents";
import { mapIncidentSelectors } from "@/store/mapIncident";
import { WarningType } from "@/types/IWarning";

import useWarningListener from "./useWarningListener";

const useIncidents = () => {
    const { authToken } = useContext(AuthContext);
    const { userLocation } = useContext(UserLocationContext);
    const showIncidents = useSelector(mapIncidentSelectors.showIncident);
    const playAcousticWarning = useSelector(mapIncidentSelectors.playAcousticWarning);
    const [incidents, setIncidents] = useState<FeatureCollection | undefined>(undefined);
    const { warning: incidentWarning } = useWarningListener({
        eventType: WarningType.INCIDENT,
        playAcousticWarning,
        userLocation,
    });

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
                authToken: String(authToken?.token),
                userLonLat: { lon: longitude, lat: latitude },
            }),
        enabled: showIncidents && !!authToken?.token && !!longitude && !!latitude,
        staleTime: Infinity,
        refetchInterval: REFETCH_INTERVAL.INCIDENTS_IN_MINUTES,
    });

    useEffect(() => {
        if (!data || !showIncidents || !longitude || !latitude) {
            setIncidents(DEFAULT_FC);
            return;
        }

        setIncidents(data);
    }, [data, showIncidents, longitude, latitude]);

    return { incidents, incidentWarning, loadingIncidents, errorIncidents };
};

export default useIncidents;
