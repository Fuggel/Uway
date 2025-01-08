import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { SIZES } from "@/constants/size-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { useSearchLocation, useSearchSuggestion } from "@/hooks/useSearch";
import useSpeechToText from "@/hooks/useSpeechToText";
import store from "@/store";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapSearchSelectors } from "@/store/mapSearch";
import { distanceToPointText, readableDistance } from "@/utils/map-utils";

import Searchbar from "../common/Searchbar";
import Text from "../common/Text";
import NoResults from "../ui/NoResults";

interface MapSearchProps {
    onClose: () => void;
}

const MapSearch = ({ onClose }: MapSearchProps) => {
    const dispatch = useDispatch();
    const { userLocation } = useContext(UserLocationContext);
    const searchQuery = useSelector(mapNavigationSelectors.searchQuery);
    const location = useSelector(mapNavigationSelectors.location);
    const locationId = useSelector(mapNavigationSelectors.locationId);
    const recentSearches = useSelector(mapSearchSelectors.recentSearches);
    const { text, isListening, startListening, stopListening } = useSpeechToText();
    const { suggestions } = useSearchSuggestion({ query: searchQuery });
    const [showSuggestions, setShowSuggestions] = useState(false);

    useSearchLocation();

    const longitude = userLocation?.coords.longitude as number;
    const latitude = userLocation?.coords.latitude as number;

    const selectedSuggestion = suggestions?.find((suggestion) => suggestion.mapbox_id === locationId);

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
            value={
                selectedSuggestion ? `${selectedSuggestion.name} ${selectedSuggestion.place_formatted}` : searchQuery
            }
            speechToText={{ isListening, startListening, stopListening }}
            onClear={() => {
                location
                    ? dispatch(mapNavigationActions.handleCancelNavigation())
                    : dispatch(mapNavigationActions.setSearchQuery(""));
            }}
        >
            {showSuggestions && searchQuery && (
                <ScrollView style={styles.suggestions}>
                    {suggestions && suggestions.length > 0 ? (
                        suggestions.map((suggestion, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.scrollContainer}
                                onPress={() => {
                                    dispatch(mapNavigationActions.setLocationId(suggestion.mapbox_id));
                                    handleLocationComplete();
                                }}
                            >
                                <View style={styles.suggestionItem}>
                                    <View style={styles.suggestionPlace}>
                                        <MaterialCommunityIcons name="map-marker" size={24} color="black" />
                                        <Text>
                                            {suggestion.name}, {suggestion.place_formatted}
                                        </Text>
                                    </View>
                                    <Text type="gray" textStyle="caption">
                                        {readableDistance(suggestion.distance)}
                                    </Text>
                                </View>
                                <Divider style={styles.divider} />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <NoResults text="Keine Ergebnisse gefunden." />
                    )}
                </ScrollView>
            )}

            {!searchQuery && (
                <View style={styles.suggestions}>
                    {recentSearches.length > 0 ? (
                        recentSearches.map((location, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.scrollContainer}
                                onPress={() => {
                                    dispatch(mapNavigationActions.setLocation(location));
                                    handleLocationComplete();
                                }}
                            >
                                <View style={styles.suggestionItem}>
                                    <View style={styles.suggestionPlace}>
                                        <MaterialCommunityIcons name="history" size={24} color="black" />
                                        <Text>
                                            {location.name}, {location.place_formatted}
                                        </Text>
                                    </View>

                                    <Text type="gray" textStyle="caption">
                                        {distanceToPointText({
                                            pos1: [longitude, latitude],
                                            pos2: [location?.coordinates?.longitude, location?.coordinates?.latitude],
                                        })}
                                    </Text>
                                </View>
                                <Divider style={styles.divider} />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <NoResults text="Keine letzten Suchen." />
                    )}
                </View>
            )}
        </Searchbar>
    );
};

const styles = StyleSheet.create({
    suggestions: {
        padding: SIZES.spacing.sm,
        marginTop: 2,
        borderRadius: SIZES.borderRadius.sm,
    },
    suggestionPlace: {
        flexDirection: "row",
        maxWidth: "75%",
        alignItems: "center",
        gap: SIZES.spacing.xs,
    },
    suggestionItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },
    scrollContainer: {
        marginVertical: 4,
    },
    divider: {
        marginTop: SIZES.spacing.xs,
    },
});

export default MapSearch;
