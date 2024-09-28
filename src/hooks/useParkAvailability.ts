import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FeatureCollection } from "@turf/helpers";
import { fetchParkAvailability } from "../services/park-availability";
import { useSelector } from "react-redux";
import { mapParkAvailabilitySelectors } from "../store/mapParkAvailability";
import { isValidLonLat } from "../utils/map-utils";

export default function useParkAvailability() {
    const showParkAvailability = useSelector(mapParkAvailabilitySelectors.showParkAvailability);
    const [parkAvailability, setParkAvailability] = useState<FeatureCollection | null>(null);

    const { data, isLoading: loadingParkAvailability, error: errorParkAvailability } = useQuery({
        queryKey: ["parkAvailability", showParkAvailability],
        queryFn: () => fetchParkAvailability(),
        enabled: showParkAvailability,
        staleTime: Infinity,
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
}