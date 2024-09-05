import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import Searchbar from "../common/Searchbar";
import { Divider } from "react-native-paper";
import { SIZES } from "../../constants/size-constants";
import { COLORS } from "../../constants/colors-constants";
import { useDispatch, useSelector } from "react-redux";
import { mapNavigationActions, mapNavigationSelectors } from "../../store/mapNavigation";
import { Suggestion } from "@/src/types/ISearch";
import { useState } from "react";
import { determineTheme, dynamicThemeStyles } from "@/src/utils/theme-utils";
import { mapViewSelectors } from "@/src/store/mapView";

interface MapSearchbarProps {
    suggestions: Suggestion | null;
}

const deviceHeight = Dimensions.get("window").height;

export default function MapSearchbar({ suggestions }: MapSearchbarProps) {
    const dispatch = useDispatch();
    const searchQuery = useSelector(mapNavigationSelectors.searchQuery);
    const locationId = useSelector(mapNavigationSelectors.locationId);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const selectedSuggestion = suggestions?.suggestions.find(suggestion => suggestion.mapbox_id === locationId);
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
            {showSuggestions && suggestions &&
                <ScrollView>
                    {suggestions.suggestions
                        .map((suggestion) => (
                            <TouchableOpacity
                                key={suggestion.mapbox_id}
                                style={styles.scrollContainer}
                                onPress={() => handleSelectLocation(suggestion.mapbox_id)}
                            >
                                <Text>{suggestion.name}, {suggestion.place_formatted}</Text>
                                <Divider style={styles.divider} />
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            }
        </Searchbar>
    );
}

const styles = StyleSheet.create({
    search: {
        position: "absolute",
        top: deviceHeight > 1000 ? "4%" : "7%",
        left: SIZES.spacing.sm,
        minWidth: "65%",
        maxWidth: "75%",
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