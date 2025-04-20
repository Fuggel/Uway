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
import { GasStation } from "@/types/IGasStation";
import { getStationIcon } from "@/utils/map-utils";

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
            setGasStations({
                ...data,
                features: data?.features?.map((feature) => {
                    const properties = feature.properties;
                    const iconType = getStationIcon(
                        data.features.map((f) => f.properties as unknown as GasStation),
                        (properties as unknown as GasStation).diesel
                    );
                    return {
                        ...feature,
                        properties: {
                            ...properties,
                            iconType,
                        },
                    };
                }),
            });
        } else {
            setGasStations(DEFAULT_FC);
        }
    }, [data, longitude, latitude]);

    return { gasStations, loadingGasStations, errorGasStations };
};

export default useGasStations;
