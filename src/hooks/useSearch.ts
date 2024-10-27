import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { fetchSearch } from "@/services/search";
import { SearchLocation } from "@/types/ISearch";

const useSearch = (params: { query: string }) => {
    const [suggestions, setSuggestions] = useState<SearchLocation[] | null>(null);

    const {
        data: suggestionData,
        isLoading: loadingSearch,
        error: errorSearch,
    } = useQuery({
        queryKey: ["search", params.query],
        queryFn: () => fetchSearch({ query: params.query }),
        enabled: params.query.length > 0,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (suggestionData) {
            setSuggestions(suggestionData);
        }

        if (params.query.length === 0) {
            setSuggestions(null);
        }
    }, [suggestionData]);

    return { suggestions, loadingSearch, errorSearch };
};

export default useSearch;
