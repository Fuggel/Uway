import axios from "axios";

import { API } from "@/constants/env-constants";
import { LonLat } from "@/types/IMap";
import { SearchFeatureCollection, SearchSuggestion } from "@/types/ISearch";

export async function fetchSearchSuggestion(params: {
    authToken: string;
    query: string;
    sessionToken: string;
    lngLat: LonLat;
}): Promise<SearchSuggestion> {
    try {
        if (!params.lngLat.lon || !params.lngLat.lat) {
            return { suggestions: [] };
        }

        const queryParams = new URLSearchParams();
        queryParams.append("query", params.query);
        queryParams.append("sessionToken", params.sessionToken);
        queryParams.append("lon", params.lngLat.lon.toString());
        queryParams.append("lat", params.lngLat.lat.toString());

        const url = `${API.UWAY_URL}/search-suggestions?${queryParams.toString()}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${params.authToken}`,
            },
        });

        return response.data.data;
    } catch (error) {
        console.log(`Error fetching search suggestions: ${error}`);
        return { suggestions: [] };
    }
}

export async function fetchSearchLocation(params: {
    authToken: string;
    mapboxId: string;
    sessionToken: string;
}): Promise<SearchFeatureCollection> {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append("mapboxId", params.mapboxId);
        queryParams.append("sessionToken", params.sessionToken);

        const url = `${API.UWAY_URL}/search-locations?${queryParams.toString()}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${params.authToken}`,
            },
        });

        return response.data.data;
    } catch (error) {
        console.log(`Error fetching search results: ${error}`);
        return { type: "FeatureCollection", features: [] };
    }
}
