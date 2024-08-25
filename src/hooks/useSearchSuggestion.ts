import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchSearchSuggestion } from "../services/search";
import { Suggestion } from "../types/IMap";

export default function useSearchSuggestion(params: { query: string; sessionToken: string; }) {
    const [suggestions, setSuggestions] = useState<Suggestion | null>(null);

    const { data: suggestionData, isLoading: loadingSearchSuggestion, error: errorSearchSuggestion } = useQuery({
        queryKey: ["searchSuggestion", params.query],
        queryFn: () => fetchSearchSuggestion({ query: params.query, sessionToken: params.sessionToken }),
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
}