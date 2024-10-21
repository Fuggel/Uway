import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Divider } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import useSearch from "@/hooks/useSearch";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapViewSelectors } from "@/store/mapView";
import { SearchLocation } from "@/types/ISearch";
import { determineTheme, dynamicThemeStyles } from "@/utils/theme-utils";

import Searchbar from "../common/Searchbar";
import Text from "../common/Text";

const MapSearchbar = () => {
    const dispatch = useDispatch();
    const searchQuery = useSelector(mapNavigationSelectors.searchQuery);
    const location = useSelector(mapNavigationSelectors.location);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
    const { suggestions } = useSearch({ query: searchQuery });
    const [showSuggestions, setShowSuggestions] = useState(false);

    const selectedSuggestion = suggestions?.find(
        (suggestion) => suggestion.lon === location?.lon && suggestion.lat === location?.lat
    );
    const searchbarValue = selectedSuggestion ? `${selectedSuggestion.formatted}` : searchQuery;

    const handleSearch = (val: string) => {
        dispatch(mapNavigationActions.setSearchQuery(val));
        setShowSuggestions(true);
    };

    const handleSelectLocation = (newLocation: SearchLocation) => {
        dispatch(mapNavigationActions.setLocation(newLocation));
        setShowSuggestions(false);
    };

    return (
        <Searchbar
            st={styles.search}
            listSt={dynamicThemeStyles(styles.suggestions, determineTheme(mapStyle))}
            placeholder="Suche nach Ort"
            onChangeText={handleSearch}
            value={searchbarValue}
        >
            {showSuggestions && suggestions && (
                <ScrollView>
                    {suggestions.map((suggestion, i) => (
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
                    ))}
                </ScrollView>
            )}
        </Searchbar>
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
});

export default MapSearchbar;
