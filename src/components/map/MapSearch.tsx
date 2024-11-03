import { useContext, useEffect, useState } from "react";
import { Keyboard, StyleSheet, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { SIZES } from "@/constants/size-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useSearch from "@/hooks/useSearch";
import useSpeechToText from "@/hooks/useSpeechToText";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapSearchSelectors } from "@/store/mapSearch";
import { mapViewSelectors } from "@/store/mapView";
import { OpenSheet } from "@/types/IMap";
import { SearchLocation } from "@/types/ISearch";
import { distanceToPointText } from "@/utils/map-utils";
import { determineTheme, dynamicThemeStyles } from "@/utils/theme-utils";

import BottomSheetComponent from "../common/BottomSheet";
import Searchbar from "../common/Searchbar";
import Text from "../common/Text";
import NoResults from "../ui/NoResults";

interface MapSearchProps {
    setOpen: React.Dispatch<React.SetStateAction<OpenSheet>>;
}

const MapSearch = ({ setOpen }: MapSearchProps) => {
    const dispatch = useDispatch();
    const { userLocation } = useContext(UserLocationContext);
    const searchQuery = useSelector(mapNavigationSelectors.searchQuery);
    const location = useSelector(mapNavigationSelectors.location);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
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
        setShowSuggestions(false);
        setOpen((prev) => ({ ...prev, search: false }));
    };

    useEffect(() => {
        if (text) {
            dispatch(mapNavigationActions.setSearchQuery(text));
            setShowSuggestions(true);
        }
    }, [text]);

    return (
        <BottomSheetComponent
            height="100%"
            snapPoints={["85%", "100%"]}
            onClose={() => {
                setOpen((prev) => ({ ...prev, search: false }));
                dispatch(mapNavigationActions.setSearchQuery(""));
            }}
        >
            <TouchableOpacity activeOpacity={1} style={styles.container} onPress={Keyboard.dismiss}>
                <Searchbar
                    placeholder="Suche nach Ort"
                    onChangeText={handleSearch}
                    value={location?.formatted || searchQuery}
                    speechToText={{ isListening, startListening, stopListening }}
                >
                    {showSuggestions && searchQuery && (
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
                                        <View style={styles.suggestionItem}>
                                            <View style={styles.suggestionPlace}>
                                                <MaterialCommunityIcons name="map-marker" size={24} color="black" />
                                                <Text type="dark">{suggestion.formatted}</Text>
                                            </View>
                                            <Text type="secondary" textStyle="caption">
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
                        <ScrollView style={dynamicThemeStyles(styles.suggestions, determineTheme(mapStyle))}>
                            {recentSearches.length > 0 ? (
                                recentSearches.map((location, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        style={styles.scrollContainer}
                                        onPress={() => handleSelectLocation(location as SearchLocation)}
                                    >
                                        <View style={styles.suggestionItem}>
                                            <View style={styles.suggestionPlace}>
                                                <MaterialCommunityIcons name="history" size={24} color="black" />
                                                <Text type="dark">{location?.formatted}</Text>
                                            </View>

                                            <Text type="secondary" textStyle="caption">
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
                        </ScrollView>
                    )}
                </Searchbar>
            </TouchableOpacity>
        </BottomSheetComponent>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: SIZES.spacing.xl,
        paddingHorizontal: SIZES.spacing.xs,
        height: "100%",
    },
    suggestions: {
        padding: SIZES.spacing.sm,
        marginTop: 2,
        borderRadius: SIZES.borderRadius.sm,
    },
    suggestionPlace: {
        flexDirection: "row",
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
    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: SIZES.spacing.sm,
        flexWrap: "wrap",
    },
});

export default MapSearch;
