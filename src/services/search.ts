import axios from "axios";
import { MAPBOX_SEARCH_RETRIEVE_API, MAPBOX_SEARCH_SUGGESTION_API } from "@/src/constants/api-constants";
import { MAP_CONFIG } from "@/src/constants/map-constants";

export async function fetchSearchSuggestion(params: { query: string; sessionToken: string; }) {
    try {
        const url = `${MAPBOX_SEARCH_SUGGESTION_API}?q=${encodeURIComponent(params.query)}&session_token=${params.sessionToken}&access_token=${MAP_CONFIG.accessToken}`;
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