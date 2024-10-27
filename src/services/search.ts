import axios from "axios";

import { GEOAPIFY_AUTOCOMPLETE_API } from "@/constants/api-constants";
import { SearchLocation } from "@/types/ISearch";

export async function fetchSearch(params: { query: string }): Promise<SearchLocation[]> {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append("text", params.query);
        queryParams.append("apiKey", process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY || "");
        queryParams.append("limit", "10");
        queryParams.append("lang", "de");
        queryParams.append("format", "json");
        queryParams.append("filter", `countrycode:de`);

        const url = `${GEOAPIFY_AUTOCOMPLETE_API}?${queryParams.toString()}`;
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
