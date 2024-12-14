import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { SIZES } from "@/constants/size-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useSearch from "@/hooks/useSearch";
import useSpeechToText from "@/hooks/useSpeechToText";
import useTextToSpeech from "@/hooks/useTextToSpeech";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapSearchSelectors } from "@/store/mapSearch";
import { SearchLocation } from "@/types/ISearch";
import { generateRandomNumber } from "@/utils/auth-utils";
import { distanceToPointText } from "@/utils/map-utils";

import Searchbar from "../common/Searchbar";
import Text from "../common/Text";
import NoResults from "../ui/NoResults";

interface MapSearchProps {
    onClose: () => void;
}

const MapSearch = ({ onClose }: MapSearchProps) => {
    const dispatch = useDispatch();
    const { userLocation } = useContext(UserLocationContext);
    const { stopSpeech } = useTextToSpeech();
    const searchQuery = useSelector(mapNavigationSelectors.searchQuery);
    const location = useSelector(mapNavigationSelectors.location);
    const recentSearches = useSelector(mapSearchSelectors.recentSearches);
    const { text, isListening, startListening, stopListening } = useSpeechToText();
    const { suggestions } = useSearch({ query: searchQuery });
    const [showSuggestions, setShowSuggestions] = useState(false);

    const longitude = userLocation?.coords.longitude as number;
    const latitude = userLocation?.coords.latitude as number;

    const handleSearch = (val: string) => {
        dispatch(mapNavigationActions.setSearchQuery(val));
        setShowSuggestions(true);
    };

    const handleSelectLocation = (newLocation: SearchLocation) => {
        dispatch(mapNavigationActions.setLocation(newLocation));
        dispatch(mapNavigationActions.setIsNavigationSelecting(true));
        setShowSuggestions(false);
        onClose();
    };

    const cancelNavigation = () => {
        dispatch(mapNavigationActions.handleCancelNavigation());
        stopSpeech();
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
            value={location?.formatted || searchQuery}
            speechToText={{ isListening, startListening, stopListening }}
            onClear={() => {
                location ? cancelNavigation() : dispatch(mapNavigationActions.setSearchQuery(""));
            }}
        >
            {showSuggestions && searchQuery && (
                <ScrollView style={styles.suggestions}>
                    {suggestions && suggestions.length > 0 ? (
                        suggestions.map((suggestion, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.scrollContainer}
                                onPress={() =>
                                    handleSelectLocation({
                                        id: generateRandomNumber(),
                                        formatted: suggestion.formatted,
                                        lat: suggestion.lat,
                                        lon: suggestion.lon,
                                        country: suggestion.country,
                                        country_code: suggestion.country_code,
                                        city: suggestion.city,
                                        district: suggestion.district,
                                        address_line1: suggestion.address_line1,
                                        address_line2: suggestion.address_line2,
                                        category: suggestion.category,
                                        place_id: suggestion.place_id,
                                        suburb: suggestion.suburb,
                                    })
                                }
                            >
                                <View style={styles.suggestionItem}>
                                    <View style={styles.suggestionPlace}>
                                        <MaterialCommunityIcons name="map-marker" size={24} color="black" />
                                        <Text>{suggestion.formatted}</Text>
                                    </View>
                                    <Text type="gray" textStyle="caption">
                                        {distanceToPointText({
                                            pos1: [longitude, latitude],
                                            pos2: [suggestion.lon, suggestion.lat],
                                        })}
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
                                onPress={() =>
                                    handleSelectLocation({
                                        ...location,
                                        id: generateRandomNumber(),
                                    })
                                }
                            >
                                <View style={styles.suggestionItem}>
                                    <View style={styles.suggestionPlace}>
                                        <MaterialCommunityIcons name="history" size={24} color="black" />
                                        <Text>{location?.formatted}</Text>
                                    </View>

                                    <Text type="gray" textStyle="caption">
                                        {distanceToPointText({
                                            pos1: [longitude, latitude],
                                            pos2: [location.lon, location.lat],
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
