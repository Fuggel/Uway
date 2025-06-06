import axios from "axios";

import { API } from "@/constants/env-constants";
import { LonLat } from "@/types/IMap";
import { ExcludeTypes } from "@/types/INavigation";
import { prepareExludeTypes } from "@/utils/map-utils";

export async function fetchDirections(params: {
    authToken: string;
    profile: string;
    startLngLat: LonLat;
    destinationLngLat: LonLat;
    excludeTypes: ExcludeTypes;
}) {
    try {
        const { lon: startLon, lat: startLat } = params.startLngLat;
        const { lon: destLon, lat: destLat } = params.destinationLngLat;

        if (!startLon || !startLat || !destLon || !destLat) {
            return [];
        }

        const queryParams = new URLSearchParams();
        queryParams.append("profile", params.profile);
        queryParams.append("startCoordinates", `${startLon},${startLat}`);
        queryParams.append("destinationCoordinates", `${destLon},${destLat}`);

        if (params.excludeTypes && Object.keys(params.excludeTypes).length > 0) {
            const exludeTypes = prepareExludeTypes(params.excludeTypes);

            queryParams.append("exclude", exludeTypes);
        }

        const url = `${API.UWAY_URL}/directions?${queryParams.toString()}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${params.authToken}`,
            },
        });

        return response.data.data;
    } catch (error) {
        console.log(`Error fetching directions: ${error}`);
        return [];
    }
}
