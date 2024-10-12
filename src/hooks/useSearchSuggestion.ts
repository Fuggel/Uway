import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { fetchSearchSuggestion } from "@/services/search";
import { LonLat } from "@/types/IMap";
import { Suggestion } from "@/types/ISearch";

const useSearchSuggestion = (params: { query: string; sessionToken: string; lngLat: LonLat }) => {
    const [suggestions, setSuggestions] = useState<Suggestion | null>(null);

    const {
        data: suggestionData,
        isLoading: loadingSearchSuggestion,
        error: errorSearchSuggestion,
    } = useQuery({
        queryKey: ["searchSuggestion", params.query],
        queryFn: () =>
            fetchSearchSuggestion({
                query: params.query,
                sessionToken: params.sessionToken,
                lngLat: params.lngLat,
            }),
        enabled: params.query.length > 0,
        staleTime: Infinity,
    });

    useEffect(() => {
        setSuggestions(suggestionData);

        if (params.query.length === 0) {
            setSuggestions(null);
        }
    }, [suggestionData]);

    return { suggestions, loadingSearchSuggestion, errorSearchSuggestion };
};

export default useSearchSuggestion;
