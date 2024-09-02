import axios from "axios";
import { MAPBOX_SEARCH_RETRIEVE_API, MAPBOX_SEARCH_SUGGESTION_API } from "@/src/constants/api-constants";
import { MAP_CONFIG } from "@/src/constants/map-constants";
import { LonLat } from "../types/IMap";

export async function fetchSearchSuggestion(params: {
    query: string;
    sessionToken: string;
    lngLat: LonLat;
}) {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append("q", params.query);
        queryParams.append("session_token", params.sessionToken);
        queryParams.append("access_token", MAP_CONFIG.accessToken);
        queryParams.append("proximity", `${params.lngLat.lon},${params.lngLat.lat}`);
        queryParams.append("types", "address,street,place,poi,locality,city,district");
        queryParams.append("language", "de");

        const url = `${MAPBOX_SEARCH_SUGGESTION_API}?${queryParams.toString()}`;
        const response = await axios.get(url);

        return response.data;
    } catch (error) {
        console.log(`Error fetching search suggestions: ${error}`);
        return [];
    }
}

export async function fetchSearchLocation(params: { mapboxId: string; sessionToken: string; }) {
    try {
        const url = `${MAPBOX_SEARCH_RETRIEVE_API}/${params.mapboxId}?session_token=${params.sessionToken}&access_token=${MAP_CONFIG.accessToken}`;
        const response = await axios.get(url);

        return response.data;
    } catch (error) {
        console.log(`Error fetching search results: ${error}`);
        return [];
    }
}