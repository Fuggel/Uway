import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";

import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchSearchLocation, fetchSearchSuggestion } from "@/services/search";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { SearchSuggestionProperties } from "@/types/ISearch";
import { generateRandomNumber } from "@/utils/auth-utils";

export const useSearchSuggestion = (params: { query: string }) => {
    const { userLocation } = useContext(UserLocationContext);
    const [suggestions, setSuggestions] = useState<SearchSuggestionProperties[] | null>(null);

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;

    const {
        data: suggestionData,
        isLoading: loadingSearch,
        error: errorSearch,
    } = useQuery({
        queryKey: ["searchSuggestion", params.query],
        queryFn: () =>
            fetchSearchSuggestion({
                query: params.query,
                sessionToken: generateRandomNumber(),
                lngLat: { lon: longitude, lat: latitude },
            }),
        enabled: params.query.length > 0,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (suggestionData) {
            setSuggestions(suggestionData.suggestions);
        }

        if (params.query.length === 0) {
            setSuggestions(null);
        }
    }, [suggestionData]);

    return { suggestions, loadingSearch, errorSearch };
};

export const useSearchLocation = () => {
    const dispatch = useDispatch();
    const locationId = useSelector(mapNavigationSelectors.locationId);

    const {
        data: searchData,
        isLoading: loadingSearchData,
        error: errorSearchData,
    } = useQuery({
        queryKey: ["searchLocation", locationId],
        queryFn: () =>
            fetchSearchLocation({
                mapboxId: locationId,
                sessionToken: generateRandomNumber(),
            }),
        enabled: locationId.length > 0,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (searchData) {
            dispatch(mapNavigationActions.setLocation(searchData.features[0].properties));
        }
    }, [searchData]);

    return { loadingSearchData, errorSearchData };
};
