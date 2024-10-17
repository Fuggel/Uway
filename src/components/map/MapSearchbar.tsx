import { useContext, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Divider } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { sessionToken } from "@/constants/auth-constants";
import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useSearchSuggestion from "@/hooks/useSearchSuggestion";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapViewSelectors } from "@/store/mapView";
import { determineTheme, dynamicThemeStyles } from "@/utils/theme-utils";

import Searchbar from "../common/Searchbar";
import Text from "../common/Text";

const MapSearchbar = () => {
    const dispatch = useDispatch();
    const searchQuery = useSelector(mapNavigationSelectors.searchQuery);
    const locationId = useSelector(mapNavigationSelectors.locationId);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
    const { userLocation } = useContext(UserLocationContext);
    const { suggestions } = useSearchSuggestion({
        query: searchQuery,
        sessionToken,
        lngLat: {
            lon: userLocation?.coords?.longitude as number,
            lat: userLocation?.coords?.latitude as number,
        },
    });

    const [showSuggestions, setShowSuggestions] = useState(false);

    const selectedSuggestion = suggestions?.suggestions?.find((suggestion) => suggestion.mapbox_id === locationId);
    const searchbarValue = selectedSuggestion
        ? `${selectedSuggestion.name} ${selectedSuggestion.place_formatted}`
        : searchQuery;

    const handleSearch = (val: string) => {
        dispatch(mapNavigationActions.setSearchQuery(val));
        setShowSuggestions(true);
    };

    const handleSelectLocation = (id: string) => {
        dispatch(mapNavigationActions.setLocationId(id));
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
                    {suggestions.suggestions.map((suggestion) => (
                        <TouchableOpacity
                            key={suggestion.mapbox_id}
                            style={styles.scrollContainer}
                            onPress={() => handleSelectLocation(suggestion.mapbox_id)}
                        >
                            <Text type="dark">
                                {suggestion.name}, {suggestion.place_formatted}
                            </Text>
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
