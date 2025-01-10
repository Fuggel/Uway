import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useSearchLocation, useSearchSuggestion } from "@/hooks/useSearch";
import useSpeechToText from "@/hooks/useSpeechToText";
import store from "@/store";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";

import Searchbar from "../../common/Searchbar";
import RecentSearches from "./RecentSearches";
import SavedSearches from "./SavedSearches";
import SearchSuggestions from "./SearchSuggestions";

interface MapSearchProps {
    onClose: () => void;
}

const MapSearch = ({ onClose }: MapSearchProps) => {
    const dispatch = useDispatch();
    const searchQuery = useSelector(mapNavigationSelectors.searchQuery);
    const location = useSelector(mapNavigationSelectors.location);
    const locationId = useSelector(mapNavigationSelectors.locationId);
    const { text, isListening, startListening, stopListening } = useSpeechToText();
    const { suggestions } = useSearchSuggestion({ query: searchQuery });
    const [showSuggestions, setShowSuggestions] = useState(false);

    useSearchLocation();

    const selectedSuggestion = suggestions?.find((suggestion) => suggestion.default_id === locationId?.default);

    const handleSearch = (val: string) => {
        dispatch(mapNavigationActions.setSearchQuery(val));
        setShowSuggestions(true);
    };

    const handleLocationComplete = () => {
        dispatch(mapNavigationActions.setIsNavigationSelecting(true));
        setShowSuggestions(false);

        const unsubscribe = store.subscribe(() => {
            const selectedLocation = store.getState().mapNavigation.location;
            if (selectedLocation) {
                unsubscribe();
                onClose();
            }
        });
    };

    useEffect(() => {
        if (text) {
            dispatch(mapNavigationActions.setSearchQuery(text));
            setShowSuggestions(true);
        }
    }, [text]);

    return (
        <Searchbar
            placeholder="Suche nach Ort"
            onChangeText={handleSearch}
            value={selectedSuggestion ? selectedSuggestion.name : searchQuery}
            speechToText={{ isListening, startListening, stopListening }}
            onClear={() => {
                location
                    ? dispatch(mapNavigationActions.handleCancelNavigation())
                    : dispatch(mapNavigationActions.setSearchQuery(""));
            }}
        >
            <SavedSearches />

            {showSuggestions && searchQuery && (
                <SearchSuggestions suggestions={suggestions} handleLocationComplete={handleLocationComplete} />
            )}

            {!searchQuery && <RecentSearches handleLocationComplete={handleLocationComplete} />}
        </Searchbar>
    );
};

export default MapSearch;
