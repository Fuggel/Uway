import { usePathname } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider } from "react-native-paper";
import { useDispatch } from "react-redux";

import { SIZES } from "@/constants/size-constants";
import { mapNavigationActions } from "@/store/mapNavigation";
import { SearchSuggestionProperties } from "@/types/ISearch";
import { readableDistance } from "@/utils/map-utils";

import Text from "../../common/Text";
import MakiIcon from "../../ui/MakiIcon";
import NoResults from "../../ui/NoResults";

interface SearchSuggestionsProps {
    suggestions: SearchSuggestionProperties[] | null;
    handleLocationComplete: () => void;
    handlePoiLocationComplete: () => void;
}

const SearchSuggestions = ({
    suggestions,
    handleLocationComplete,
    handlePoiLocationComplete,
}: SearchSuggestionsProps) => {
    const dispatch = useDispatch();
    const pathname = usePathname();

    const handleLocation = (suggestion: SearchSuggestionProperties) => {
        dispatch(
            mapNavigationActions.setLocationId({
                default: suggestion.default_id,
                mapbox_id: suggestion.mapbox_id,
                saveSearch: pathname === "/save-search",
            })
        );

        if (suggestion.feature_type === "category") {
            handlePoiLocationComplete();
            return;
        }

        handleLocationComplete();
    };

    return (
        <ScrollView style={styles.suggestions}>
            {suggestions && suggestions.length > 0 ? (
                suggestions.map((suggestion, i) => (
                    <TouchableOpacity key={i} onPress={() => handleLocation(suggestion)}>
                        <View style={styles.suggestionItem}>
                            <View style={styles.suggestionPlace}>
                                <MakiIcon name={suggestion.maki} type={suggestion.feature_type} />
                                <View style={styles.locationItem}>
                                    <Text style={{ fontWeight: "bold" }}>{suggestion.name}</Text>
                                    {suggestion.place_formatted && (
                                        <Text type="gray" textStyle="caption">
                                            {suggestion.feature_type === "category"
                                                ? "Kategorie"
                                                : suggestion.place_formatted}
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <Text type="gray" textStyle="caption">
                                {suggestion.feature_type !== "category" && readableDistance(suggestion.distance)}
                            </Text>
                        </View>
                        <Divider />
                    </TouchableOpacity>
                ))
            ) : (
                <NoResults text="Keine Ergebnisse gefunden." />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    suggestions: {
        paddingVertical: SIZES.spacing.sm,
        marginTop: 2,
        borderRadius: SIZES.borderRadius.sm,
    },
    locationItem: {
        width: "70%",
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
        paddingVertical: SIZES.spacing.xs,
        paddingRight: SIZES.spacing.md,
        paddingLeft: SIZES.spacing.sm,
    },
});

export default SearchSuggestions;
