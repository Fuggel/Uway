import { usePathname, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { SIZES } from "@/constants/size-constants";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { useSearchLocation, useSearchSuggestion } from "@/hooks/useSearch";
import useSpeechToText from "@/hooks/useSpeechToText";
import store from "@/store";
import { mapLayoutsActions, mapLayoutsSelectors } from "@/store/mapLayouts";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapSearchActions, mapSearchSelectors } from "@/store/mapSearch";
import { SaveSearchError, SavedSearchLocation } from "@/types/ISearch";
import { SheetType } from "@/types/ISheet";

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
    const { openSheet } = useContext(BottomSheetContext);
    const openSearchModal = useSelector(mapLayoutsSelectors.openSearchModal);
    const [savedSearchName, setSavedSearchName] = useState("");
    const [saveSearchError, setSaveSearchError] = useState<SaveSearchError>(SaveSearchError.NONE);
    const searchQuery = useSelector(mapNavigationSelectors.searchQuery);
    const location = useSelector(mapNavigationSelectors.location);
    const locationId = useSelector(mapNavigationSelectors.locationId);
    const saveSearch = useSelector(mapSearchSelectors.saveSearch);
    const savedSearches = useSelector(mapSearchSelectors.savedSearches);
    const { text, isListening, startListening, stopListening } = useSpeechToText();
    const { suggestions } = useSearchSuggestion({ query: searchQuery });
    const [showSuggestions, setShowSuggestions] = useState(false);

    useSearchLocation();

    const selectedSuggestion = suggestions?.find((suggestion) => suggestion.mapbox_id === locationId?.mapbox_id);
    const isSaveSearchPath = pathname === "/save-search";

    const handleSearch = (val: string) => {
        dispatch(mapNavigationActions.setSearchQuery(val));
        setShowSuggestions(true);
    };

    const handleLocationComplete = () => {
        dispatch(mapNavigationActions.setIsNavigationSelecting(true));
        dispatch(mapSearchActions.setIsPoiSearch(false));
        setShowSuggestions(false);
        dispatch(mapNavigationActions.setShowRouteOptions(true));

        const unsubscribe = store.subscribe(() => {
            const selectedLocation =
                store.getState().mapNavigation.location || store.getState().mapSearch.editingSearch;
            if (selectedLocation) {
                unsubscribe();
                onClose();
            }
        });
    };

    const handlePoiLocationComplete = () => {
        setShowSuggestions(false);
        dispatch(mapLayoutsActions.setOpenCategoryLocationsList(true));
        dispatch(mapLayoutsActions.setSelectingCategoryLocation(true));
        dispatch(mapSearchActions.setIsPoiSearch(true));
        openSheet({ type: SheetType.POI });

        const unsubscribe = store.subscribe(() => {
            const selectedLocation = store.getState().mapNavigation.categoryLocation;
            if (selectedLocation) {
                unsubscribe();
                onClose();
            }
        });
    };

    const handleSaveSearch = () => {
        if (
            savedSearches.some(
                (search) => search.title === savedSearchName || search.mapbox_id === saveSearch.mapbox_id
            )
        ) {
            return setSaveSearchError(SaveSearchError.DUPLICATE);
        }

        const saveValue = { ...saveSearch, title: savedSearchName };

        dispatch(mapSearchActions.setSaveSearch(saveValue));
        dispatch(mapSearchActions.setSavedSearches([...savedSearches, saveValue]));

        handleDismissModal();

        route.back();
    };

    const handleDismissModal = () => {
        dispatch(mapSearchActions.setSaveSearch({} as SavedSearchLocation));
        dispatch(mapNavigationActions.setSearchQuery(""));
        dispatch(mapLayoutsActions.setOpenSearchModal(false));
        dispatch(mapNavigationActions.setLocationId({ default: "", mapbox_id: "", saveSearch: false }));

        setSaveSearchError(SaveSearchError.NONE);
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
                <SearchSuggestions
                    suggestions={suggestions}
                    handleLocationComplete={handleLocationComplete}
                    handlePoiLocationComplete={handlePoiLocationComplete}
                />
            )}

            {!searchQuery && <RecentSearches handleLocationComplete={handleLocationComplete} />}

            <Modal visible={openSearchModal} onSave={handleSaveSearch} onDismiss={handleDismissModal}>
                <View style={{ gap: SIZES.spacing.md }}>
                    <Text textStyle="header">Name</Text>
                    <Input value={savedSearchName} type="default" onChange={(val) => setSavedSearchName(val)} />

                    {saveSearchError === SaveSearchError.DUPLICATE && (
                        <Text type="error">
                            Es gibt bereits einen gespeicherten Ort mit diesem Namen oder dieser Adresse.
                        </Text>
                    )}
                </View>
            </Modal>
        </Searchbar>
    );
};

export default MapSearch;
