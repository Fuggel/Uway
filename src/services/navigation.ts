import axios from "axios";
import { MAPBOX_DIRECTIONS_API } from "@/src/constants/api-constants";
import { LonLat } from "@/src/types/IMap";
import { MAP_CONFIG } from "@/src/constants/map-constants";

export async function fetchDirections(
    params: {
        profile: string;
        startLngLat: LonLat;
        destinationLngLat: LonLat;
    }
) {
    try {
        const { lon: startLon, lat: startLat } = params.startLngLat;
        const { lon: destLon, lat: destLat } = params.destinationLngLat;

        const queryParams = `geometries=geojson&steps=true&language=de&overview=full&access_token=${MAP_CONFIG.accessToken}`;
        const url = `${MAPBOX_DIRECTIONS_API}/${params.profile}/${startLon},${startLat};${destLon},${destLat}?${queryParams}`;
        const response = await axios.get(url);

        return response.data;
    } catch (error) {
        console.log(`Error fetching directions: ${error}`);
        return [];
    }
}