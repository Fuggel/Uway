import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "@turf/helpers";

import { REFETCH_INTERVAL } from "@/constants/env-constants";
import { DEFAULT_FC } from "@/constants/map-constants";
import { AuthContext } from "@/contexts/AuthContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchGasStations } from "@/services/gas-stations";
import { mapGasStationSelectors } from "@/store/mapGasStation";

const useGasStations = () => {
    const { authToken } = useContext(AuthContext);
    const { userLocation } = useContext(UserLocationContext);
    const showGasStations = useSelector(mapGasStationSelectors.showGasStation);
    const [gasStations, setGasStations] = useState<FeatureCollection>(DEFAULT_FC);

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;

    const {
        data,
        isLoading: loadingGasStations,
        error: errorGasStations,
    } = useQuery({
        queryKey: ["gasStations", showGasStations],
        queryFn: () =>
            fetchGasStations({
                authToken: String(authToken?.token),
                userLonLat: { lon: longitude, lat: latitude },
            }),
        enabled: showGasStations && !!authToken?.token && !!longitude && !!latitude,
        staleTime: Infinity,
        refetchInterval: REFETCH_INTERVAL.GAS_STATIONS_IN_MINUTES,
    });

    useEffect(() => {
        if (data && showGasStations && longitude && latitude) {
            setGasStations(data);
        } else {
            setGasStations(DEFAULT_FC);
        }
    }, [data]);

    return { gasStations, loadingGasStations, errorGasStations };
};

export default useGasStations;
