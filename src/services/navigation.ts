import axios from "axios";

import { API_URL } from "@/constants/api-constants";
import { API_KEY } from "@/constants/env-constants";
import { LonLat } from "@/types/IMap";

export async function fetchDirections(params: {
    profile: string;
    startLngLat: LonLat;
    destinationLngLat: LonLat;
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
        queryParams.append("access_token", API_KEY.MAPBOX_ACCESS_TOKEN);

        if (params.waypoint) {
            queryParams.append("waypoints", "0;2");
        }

        const url = `${API_URL.MAPBOX_DIRECTIONS}/${params.profile}/${coordinates}?${queryParams.toString()}`;
        const response = await axios.get(url);

        return response.data;
    } catch (error) {
        console.log(`Error fetching directions: ${error}`);
        return [];
    }
}
