import { usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { SIZES } from "@/constants/size-constants";
import { useSearchLocation, useSearchSuggestion } from "@/hooks/useSearch";
import useSpeechToText from "@/hooks/useSpeechToText";
import store from "@/store";
import { mapLayoutsActions, mapLayoutsSelectors } from "@/store/mapLayouts";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapSearchActions, mapSearchSelectors } from "@/store/mapSearch";
import { SavedSearchLocation } from "@/types/ISearch";

import Searchbar from "../../common/Searchbar";
import RecentSearches from "./RecentSearches";
import SavedSearches from "./SavedSearches";
import SearchSuggestions from "./SearchSuggestions";

import Input from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import Text from "@/components/common/Text";

interface MapSearchProps {
    onClose: () => void;
}

const MapSearch = ({ onClose }: MapSearchProps) => {
    const dispatch = useDispatch();
    const route = useRouter();
    const pathname = usePathname();
    const openSearchModal = useSelector(mapLayoutsSelectors.openSearchModal);
    const [savedSearchName, setSavedSearchName] = useState("");
    const searchQuery = useSelector(mapNavigationSelectors.searchQuery);
    const location = useSelector(mapNavigationSelectors.location);
    const locationId = useSelector(mapNavigationSelectors.locationId);
    const saveSearch = useSelector(mapSearchSelectors.saveSearch);
    const savedSearches = useSelector(mapSearchSelectors.savedSearches);
    const { text, isListening, startListening, stopListening } = useSpeechToText();
    const { suggestions } = useSearchSuggestion({ query: searchQuery });
    const [showSuggestions, setShowSuggestions] = useState(false);

    useSearchLocation();

    const selectedSuggestion = suggestions?.find((suggestion) => suggestion.default_id === locationId?.default);
    const isSaveSearchPath = pathname === "/save-search";

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

    const handleSaveSearch = () => {
        const saveValue = { ...saveSearch, title: savedSearchName };

        dispatch(mapSearchActions.setSaveSearch(saveValue));
        dispatch(mapSearchActions.setSavedSearches([...savedSearches, saveValue]));

        handleDismissModal();

        route.back();
    };

    const handleDismissModal = () => {
        dispatch(mapLayoutsActions.setOpenSearchModal(false));
        dispatch(mapSearchActions.setSaveSearch({} as SavedSearchLocation));
        dispatch(mapNavigationActions.setSearchQuery(""));
    };

    useEffect(() => {
        if (text) {
            dispatch(mapNavigationActions.setSearchQuery(text));
            setShowSuggestions(true);
        }
    }, [text]);

    return (
        <Searchbar
            placeholder={isSaveSearchPath ? "Suche speichern" : "Suche nach Ort"}
            onChangeText={handleSearch}
            value={selectedSuggestion ? selectedSuggestion.name : searchQuery}
            speechToText={{ isListening, startListening, stopListening }}
            onClear={() => {
                location
                    ? dispatch(mapNavigationActions.handleCancelNavigation())
                    : dispatch(mapNavigationActions.setSearchQuery(""));
            }}
        >
            {!isSaveSearchPath && <SavedSearches handleLocationComplete={handleLocationComplete} />}

            {showSuggestions && searchQuery && (
                <SearchSuggestions suggestions={suggestions} handleLocationComplete={handleLocationComplete} />
            )}

            {!searchQuery && <RecentSearches handleLocationComplete={handleLocationComplete} />}

            <Modal visible={openSearchModal} onSave={handleSaveSearch} onDismiss={handleDismissModal}>
                <View style={{ gap: SIZES.spacing.md }}>
                    <Text textStyle="header">Name</Text>
                    <Input value={savedSearchName} type="default" onChange={(val) => setSavedSearchName(val)} />
                </View>
            </Modal>
        </Searchbar>
    );
};

export default MapSearch;
