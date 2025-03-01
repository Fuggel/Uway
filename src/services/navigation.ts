import axios from "axios";

import { API_URL } from "@/constants/api-constants";
import { API_KEY } from "@/constants/env-constants";
import { LonLat } from "@/types/IMap";
import { ExcludeTypes } from "@/types/INavigation";

export async function fetchDirections(params: {
    profile: string;
    startLngLat: LonLat;
    destinationLngLat: LonLat;
    excludeTypes: ExcludeTypes;
    waypoint?: LonLat;
}) {
    try {
        const { lon: startLon, lat: startLat } = params.startLngLat;
        const { lon: destLon, lat: destLat } = params.destinationLngLat;

        if (!startLon || !startLat || !destLon || !destLat) {
            return [];
        }

        const coordinates = params.waypoint
            ? `${startLon},${startLat};${params.waypoint.lon},${params.waypoint.lat};${destLon},${destLat}`
            : `${startLon},${startLat};${destLon},${destLat}`;

        const queryParams = new URLSearchParams();
        queryParams.append("geometries", "geojson");
        queryParams.append("steps", "true");
        queryParams.append("language", "de");
        queryParams.append("overview", "full");
        queryParams.append("annotations", "maxspeed,distance,duration");
        queryParams.append("banner_instructions", "true");
        queryParams.append("voice_instructions", "true");
        queryParams.append("voice_units", "metric");
        queryParams.append("roundabout_exits", "true");
        queryParams.append("alternatives", "true");
        queryParams.append("access_token", API_KEY.MAPBOX_ACCESS_TOKEN);

        if (params.waypoint) {
            queryParams.append("waypoints", "0;2");
        }

        if (params.excludeTypes && Object.keys(params.excludeTypes).length > 0) {
            const excludeTypes = Object.keys(params.excludeTypes).filter(
                (key) => params.excludeTypes[key as keyof ExcludeTypes]
            );

            queryParams.append("exclude", excludeTypes.join(","));
        }

        const url = `${API_URL.MAPBOX_DIRECTIONS}/${params.profile}/${coordinates}?${queryParams.toString()}`;
        const response = await axios.get(url);

        return response.data;
    } catch (error) {
        console.log(`Error fetching directions: ${error}`);
        return [];
    }
}
