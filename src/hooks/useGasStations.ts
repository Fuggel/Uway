import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FeatureCollection } from "@turf/helpers";
import { useSelector } from "react-redux";
import { DEFAULT_FC } from "../constants/map-constants";
import { fetchGasStations } from "../services/gas-stations";
import { mapGasStationSelectors } from "../store/mapGasStation";
import { GAS_STATIONS_REFETCH_INTERVAL } from "../constants/time-constants";

export default function useGasStations(params: { userLon: number; userLat: number; radius: number }) {
    const showGasStations = useSelector(mapGasStationSelectors.showGasStation);
    const [gasStations, setGasStations] = useState<FeatureCollection>(DEFAULT_FC);

    const {
        data,
        isLoading: loadingGasStations,
        error: errorGasStations,
    } = useQuery({
        queryKey: ["gasStations", showGasStations],
        queryFn: () =>
            fetchGasStations({
                userLon: params.userLon,
                userLat: params.userLat,
                radius: params.radius,
            }),
        enabled: showGasStations && !!params.userLon && !!params.userLat,
        staleTime: Infinity,
        refetchInterval: GAS_STATIONS_REFETCH_INTERVAL,
    });

    useEffect(() => {
        if (data && showGasStations && params.userLon && params.userLat) {
            setGasStations(data);
        } else {
            setGasStations(DEFAULT_FC);
        }
    }, [data, params.userLon, params.userLat]);

    return { gasStations, loadingGasStations, errorGasStations };
}
