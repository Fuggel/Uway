import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "@turf/helpers";

import { DEFAULT_FC, SHOW_GAS_STATIONS_THRESHOLD_IN_KILOMETERS } from "@/constants/map-constants";
import { GAS_STATIONS_REFETCH_INTERVAL } from "@/constants/time-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchGasStations } from "@/services/gas-stations";
import { mapGasStationSelectors } from "@/store/mapGasStation";

const useGasStations = () => {
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
                userLonLat: { lon: longitude, lat: latitude },
                radius: SHOW_GAS_STATIONS_THRESHOLD_IN_KILOMETERS,
            }),
        enabled: showGasStations && !!longitude && !!latitude,
        staleTime: Infinity,
        refetchInterval: GAS_STATIONS_REFETCH_INTERVAL,
    });

    useEffect(() => {
        if (data && showGasStations && longitude && latitude) {
            setGasStations(data);
        } else {
            setGasStations(DEFAULT_FC);
        }
    }, [data, longitude, latitude]);

    return { gasStations, loadingGasStations, errorGasStations };
};

export default useGasStations;
