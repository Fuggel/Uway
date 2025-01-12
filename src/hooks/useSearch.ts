import { usePathname } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";

import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchSearchLocation, fetchSearchSuggestion } from "@/services/search";
import { mapLayoutsActions } from "@/store/mapLayouts";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapSearchActions } from "@/store/mapSearch";
import { SearchSuggestionProperties } from "@/types/ISearch";
import { generateRandomId } from "@/utils/auth-utils";

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
                sessionToken: generateRandomId(),
                lngLat: { lon: longitude, lat: latitude },
            }),
        enabled: params.query.length > 0,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (suggestionData) {
            setSuggestions(suggestionData.suggestions.sort((a, b) => a.distance - b.distance));
        }

        if (params.query.length === 0) {
            setSuggestions(null);
        }
    }, [suggestionData]);

    return { suggestions, loadingSearch, errorSearch };
};

export const useSearchLocation = () => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const locationId = useSelector(mapNavigationSelectors.locationId);

    const {
        data: searchData,
        isLoading: loadingSearchData,
        error: errorSearchData,
    } = useQuery({
        queryKey: ["searchLocation", locationId],
        queryFn: () =>
            fetchSearchLocation({
                mapboxId: locationId?.mapbox_id || "",
                sessionToken: generateRandomId(),
            }),
        enabled: locationId?.mapbox_id ? locationId?.mapbox_id.length > 0 : false,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (searchData) {
            const location = { ...searchData.features[0].properties, default_id: generateRandomId() };

            if (pathname === "/save-search") {
                dispatch(mapLayoutsActions.setOpenSearchModal(true));
                dispatch(mapSearchActions.setSaveSearch(location));
            } else if (!locationId.saveSearch) {
                dispatch(mapNavigationActions.setLocation(location));
            }
        }
    }, [searchData]);

    return { loadingSearchData, errorSearchData };
};
