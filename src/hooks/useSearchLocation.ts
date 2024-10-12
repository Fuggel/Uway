import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { fetchSearchLocation } from "@/services/search";
import { Location } from "@/types/IMap";

const useSearchLocation = (params: { mapboxId: string; sessionToken: string }) => {
    const [locations, setLocations] = useState<Location | null>(null);

    const {
        data: searchData,
        isLoading: loadingSearchData,
        error: errorSearchData,
    } = useQuery({
        queryKey: ["searchData", params.mapboxId],
        queryFn: () =>
            fetchSearchLocation({
                mapboxId: params.mapboxId,
                sessionToken: params.sessionToken,
            }),
        enabled: params.mapboxId.length > 0,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (searchData) {
            setLocations(searchData.features[0]);
        }
    }, [searchData]);

    return { locations, setLocations, loadingSearchData, errorSearchData };
};

export default useSearchLocation;
