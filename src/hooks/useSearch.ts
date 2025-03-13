import { usePathname } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";

import { UserLocationContext } from "@/contexts/UserLocationContext";
import { fetchSearchLocation, fetchSearchSuggestion } from "@/services/search";
import { mapLayoutsActions } from "@/store/mapLayouts";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapSearchActions, mapSearchSelectors } from "@/store/mapSearch";
import { SearchLocation, SearchSuggestionProperties } from "@/types/ISearch";
import { generateRandomId } from "@/utils/auth-utils";
import { distanceToPointText } from "@/utils/map-utils";

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
            setSuggestions(suggestionData?.suggestions?.sort((a, b) => a.distance - b.distance));
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
    const editingSearch = useSelector(mapSearchSelectors.startEditingSearch);
    const isPoiSearch = useSelector(mapSearchSelectors.isPoiSearch);
    const { userLocation } = useContext(UserLocationContext);

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;

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
            const location = {
                ...searchData.features[0].properties,
                default_id: generateRandomId(),
            } as unknown as SearchLocation;

            const categoryFeatures = searchData.features
                .filter((feature) => feature.properties.feature_type === "poi")
                .map((feature) => ({
                    ...feature,
                    properties: {
                        ...feature.properties,
                        distance: distanceToPointText({
                            pos1: longitude && latitude ? [longitude, latitude] : undefined,
                            pos2: [
                                feature.geometry.coordinates[0] as number,
                                feature.geometry.coordinates[1] as number,
                            ],
                        }) as any,
                    },
                }));

            if (categoryFeatures.length > 0 && isPoiSearch) {
                dispatch(
                    mapNavigationActions.setCategoryLocation({
                        type: searchData.type,
                        features: categoryFeatures,
                    })
                );
                dispatch(mapNavigationActions.setSearchQuery(""));
            } else if (pathname === "/save-search" && editingSearch) {
                dispatch(mapSearchActions.updateSavedSearch({ ...location, title: editingSearch.title }));
                dispatch(mapNavigationActions.setSearchQuery(""));
                dispatch(mapSearchActions.startEditingSearch(null));
            } else if (pathname === "/save-search") {
                dispatch(mapSearchActions.startEditingSearch(null));
                dispatch(mapLayoutsActions.setOpenSearchModal(true));
                dispatch(mapSearchActions.setSaveSearch(location));
            } else if (!locationId.saveSearch && !isPoiSearch) {
                dispatch(mapNavigationActions.setLocation(location));
            }
        }
    }, [searchData]);

    return { loadingSearchData, errorSearchData };
};
