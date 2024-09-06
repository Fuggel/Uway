import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FeatureCollection } from "@turf/helpers";
import { useSelector } from "react-redux";
import { REFETCH_INTERVAL } from "../constants/time-constants";
import { DEFAULT_FC } from "../constants/map-constants";
import { fetchChargingStations } from "../services/charging-stations";
import { mapChargingStationSelectors } from "../store/mapChargingStation";

export default function useChargingStations(params: {
    userLon: number,
    userLat: number,
    distance: number;
}) {
    const showChargingStations = useSelector(mapChargingStationSelectors.showChargingStation);
    const [chargingStations, setChargingStations] = useState<FeatureCollection>(DEFAULT_FC);

    const { data, isLoading: loadingChargingStations, error: errorChargingStations } = useQuery({
        queryKey: ["chargingStations", showChargingStations],
        queryFn: () => fetchChargingStations({ userLon: params.userLon, userLat: params.userLat, distance: params.distance }),
        enabled: showChargingStations && !!params.userLon && !!params.userLat,
        refetchInterval: REFETCH_INTERVAL,
    });

    useEffect(() => {
        if (data && showChargingStations) {
            setChargingStations(data);
        } else {
            setChargingStations(DEFAULT_FC);
        }
    }, [data, params.userLon, params.userLat]);

    return { chargingStations, loadingChargingStations, errorChargingStations };
}