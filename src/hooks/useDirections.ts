import { useQuery } from "@tanstack/react-query";
import { fetchDirections } from "../services/navigation";
import { LonLat } from "../types/IMap";
import { useEffect, useState } from "react";
import { isValidLonLat } from "../utils/map-utils";
import { Direction } from "../types/INavigation";

export default function useDirections(params: {
    profile: string;
    startLngLat: LonLat;
    destinationLngLat: LonLat;
    isNavigationMode: boolean;
}) {
    const [directions, setDirections] = useState<Direction | null>(null);

    const { data, isLoading: loadingDirections, error: errorDirections } = useQuery({
        queryKey: ["directions", params.isNavigationMode, params.startLngLat, params.destinationLngLat],
        queryFn: () => fetchDirections({
            profile: params.profile,
            startLngLat: params.startLngLat,
            destinationLngLat: params.destinationLngLat
        }),
        enabled:
            params.isNavigationMode &&
            isValidLonLat(params.startLngLat.lon, params.startLngLat.lat) &&
            isValidLonLat(params.destinationLngLat.lon, params.destinationLngLat.lat),
        staleTime: Infinity,
    });

    useEffect(() => {
        if (data?.routes?.length > 0) {
            setDirections(data.routes[0]);
        }
    }, [data, params.startLngLat, params.destinationLngLat]);

    return { directions, setDirections, loadingDirections, errorDirections };
}