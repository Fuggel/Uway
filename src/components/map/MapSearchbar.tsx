import { useEffect, useState } from "react";
import { Dimensions, Keyboard, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import useSearch from "@/hooks/useSearch";
import useSpeechToText from "@/hooks/useSpeechToText";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapSearchActions, mapSearchSelectors } from "@/store/mapSearch";
import { mapViewSelectors } from "@/store/mapView";
import { SearchLocation } from "@/types/ISearch";
import { determineTheme, dynamicThemeStyles } from "@/utils/theme-utils";

import Searchbar from "../common/Searchbar";
import Text from "../common/Text";
import NoResults from "../ui/NoResults";

const MapSearchbar = () => {
    const dispatch = useDispatch();
    const searchQuery = useSelector(mapNavigationSelectors.searchQuery);
    const location = useSelector(mapNavigationSelectors.location);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
    const recentSearches = useSelector(mapSearchSelectors.recentSearches);
    const { text, isListening, startListening, stopListening } = useSpeechToText();
    const { suggestions } = useSearch({ query: searchQuery });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = (val: string) => {
        dispatch(mapNavigationActions.setSearchQuery(val));
        setShowSuggestions(true);
    };

    const handleSelectLocation = (newLocation: SearchLocation) => {
        dispatch(mapNavigationActions.setLocation(newLocation));
        setShowSuggestions(false);
        setIsFocused(false);
    };

    useEffect(() => {
        if (location) {
            dispatch(
                mapSearchActions.setRecentSearches(
                    [location, ...recentSearches.filter((loc) => loc.formatted !== location.formatted)].slice(0, 5)
                )
            );
        }
    }, [location]);

    useEffect(() => {
        if (text) {
            dispatch(mapNavigationActions.setSearchQuery(text));
            setShowSuggestions(true);
            stopListening();
        }
    }, [text]);

    return (
        <TouchableOpacity
            activeOpacity={1}
            style={{ height: Dimensions.get("window").height }}
            onPress={() => {
                setIsFocused(false);
                Keyboard.dismiss();
            }}
        >
            <Searchbar
                st={styles.search}
                placeholder="Suche nach Ort"
                onChangeText={handleSearch}
                value={location?.formatted || searchQuery}
                onFocus={() => setIsFocused(true)}
                speechToText={{ isListening, startListening, stopListening }}
            >
                {isFocused && showSuggestions && searchQuery && (
                    <ScrollView style={dynamicThemeStyles(styles.suggestions, determineTheme(mapStyle))}>
                        {suggestions && suggestions.length > 0 ? (
                            suggestions.map((suggestion, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={styles.scrollContainer}
                                    onPress={() =>
                                        handleSelectLocation({
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
                                    <Text type="dark">{suggestion.formatted}</Text>
                                    <Divider style={styles.divider} />
                                </TouchableOpacity>
                            ))
                        ) : (
                            <NoResults text="Keine Ergebnisse gefunden." />
                        )}
                    </ScrollView>
                )}

                {isFocused && !searchQuery && (
                    <ScrollView style={dynamicThemeStyles(styles.suggestions, determineTheme(mapStyle))}>
                        {recentSearches.length > 0 ? (
                            recentSearches.map((location, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={styles.scrollContainer}
                                    onPress={() => handleSelectLocation(location as SearchLocation)}
                                >
                                    <View style={styles.item}>
                                        <MaterialCommunityIcons name="history" size={24} color="black" />
                                        <Text type="dark">{location?.formatted}</Text>
                                    </View>
                                    <Divider style={styles.divider} />
                                </TouchableOpacity>
                            ))
                        ) : (
                            <NoResults text="Keine letzten Suchen." />
                        )}
                    </ScrollView>
                )}
            </Searchbar>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    search: {
        width: "65%",
    },
    suggestions: {
        backgroundColor: COLORS.white_transparent,
        padding: SIZES.spacing.sm,
        marginTop: 2,
        borderRadius: SIZES.borderRadius.sm,
    },
    scrollContainer: {
        marginVertical: 4,
    },
    divider: {
        marginTop: SIZES.spacing.xs,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: SIZES.spacing.sm,
        flexWrap: "wrap",
    },
});

export default MapSearchbar;
