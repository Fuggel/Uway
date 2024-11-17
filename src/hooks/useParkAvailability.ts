import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "@turf/helpers";

import { REFETCH_INTERVAL } from "@/constants/env-constants";
import { fetchParkAvailability } from "@/services/park-availability";
import { mapParkAvailabilitySelectors } from "@/store/mapParkAvailability";
import { isValidLonLat } from "@/utils/map-utils";

const useParkAvailability = () => {
    const showParkAvailability = useSelector(mapParkAvailabilitySelectors.showParkAvailability);
    const [parkAvailability, setParkAvailability] = useState<FeatureCollection | null>(null);

    const {
        data,
        isLoading: loadingParkAvailability,
        error: errorParkAvailability,
    } = useQuery({
        queryKey: ["parkAvailability", showParkAvailability],
        queryFn: () => fetchParkAvailability(),
        enabled: showParkAvailability,
        staleTime: Infinity,
        refetchInterval: REFETCH_INTERVAL.PARK_AVAILABILITY_IN_MINUTES,
    });

    useEffect(() => {
        if (data && showParkAvailability) {
            const filteredData = {
                ...data,
                features: data.features.filter((feature) => {
                    if (feature.geometry.type === "Point") {
                        const [lon, lat] = feature.geometry.coordinates as number[];
                        return isValidLonLat(lon, lat);
                    }
                    return false;
                }),
            };

            setParkAvailability(filteredData);
        } else {
            setParkAvailability(null);
        }
    }, [data]);

    return { parkAvailability, loadingParkAvailability, errorParkAvailability };
};

export default useParkAvailability;
