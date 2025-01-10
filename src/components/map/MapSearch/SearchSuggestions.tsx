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
}

const SearchSuggestions = ({ suggestions, handleLocationComplete }: SearchSuggestionsProps) => {
    const dispatch = useDispatch();

    return (
        <ScrollView style={styles.suggestions}>
            {suggestions && suggestions.length > 0 ? (
                suggestions.map((suggestion, i) => (
                    <TouchableOpacity
                        key={i}
                        onPress={() => {
                            dispatch(
                                mapNavigationActions.setLocationId({
                                    default: suggestion.default_id,
                                    mapbox_id: suggestion.mapbox_id,
                                })
                            );
                            handleLocationComplete();
                        }}
                    >
                        <View style={styles.suggestionItem}>
                            <View style={styles.suggestionPlace}>
                                <MakiIcon name={suggestion.maki} />
                                <View style={styles.locationItem}>
                                    <Text style={{ fontWeight: "bold" }}>{suggestion.name}</Text>
                                    {suggestion.place_formatted && (
                                        <Text type="gray" textStyle="caption">
                                            {suggestion.place_formatted}
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <Text type="gray" textStyle="caption">
                                {readableDistance(suggestion.distance)}
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
