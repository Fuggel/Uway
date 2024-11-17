import axios from "axios";

import { API_URL } from "@/constants/api-constants";
import { API_KEY } from "@/constants/env-constants";
import { SearchLocation } from "@/types/ISearch";

export async function fetchSearch(params: { query: string }): Promise<SearchLocation[]> {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append("text", params.query);
        queryParams.append("apiKey", API_KEY.GEOAPIFY);
        queryParams.append("limit", "10");
        queryParams.append("lang", "de");
        queryParams.append("format", "json");
        queryParams.append("filter", `countrycode:de`);

        const url = `${API_URL.GEOAPIFY_AUTOCOMPLETE}?${queryParams.toString()}`;
        const response = await axios.get(url);

        return response.data.results.map(
            (feature: SearchLocation): SearchLocation => ({
                country: feature.country,
                country_code: feature.country_code,
                city: feature.city,
                lon: feature.lon,
                lat: feature.lat,
                formatted: feature.formatted,
                address_line1: feature.address_line1,
                address_line2: feature.address_line2,
                district: feature.district,
                category: feature.category,
                place_id: feature.place_id,
                suburb: feature.suburb,
            })
        );
    } catch (error) {
        console.log(`Error fetching search suggestions: ${error}`);
        return [];
    }
}
