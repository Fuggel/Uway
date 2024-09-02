import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import Searchbar from "../common/Searchbar";
import { Divider } from "react-native-paper";
import { SIZES } from "../../constants/size-constants";
import { COLORS } from "../../constants/colors-constants";
import { useDispatch, useSelector } from "react-redux";
import { mapNavigationActions, mapNavigationSelectors } from "../../store/mapNavigation";
import { Suggestion } from "@/src/types/ISearch";

interface MapSearchbarProps {
    suggestions: Suggestion | null;
}

const deviceHeight = Dimensions.get("window").height;

export default function MapSearchbar({ suggestions }: MapSearchbarProps) {
    const dispatch = useDispatch();
    const searchQuery = useSelector(mapNavigationSelectors.searchQuery);

    return (
        <Searchbar
            st={styles.search}
            listSt={styles.suggestions}
            placeholder="Suche nach Ort"
            onChangeText={(val) => dispatch(mapNavigationActions.setSearchQuery(val))}
            value={searchQuery}
        >
            {suggestions?.suggestions
                .filter(suggestion => suggestion.full_address)
                .map((suggestion) => (
                    <ScrollView key={suggestion.mapbox_id}>
                        <TouchableOpacity onPress={() => dispatch(mapNavigationActions.setLocationId(suggestion.mapbox_id))}>
                            <Text>{suggestion.full_address}</Text>
                            <Divider style={styles.divider} />
                        </TouchableOpacity>
                    </ScrollView>
                ))}
        </Searchbar>
    );
}

const styles = StyleSheet.create({
    search: {
        position: "absolute",
        top: deviceHeight > 1000 ? "4%" : "7%",
        left: SIZES.spacing.sm,
        minWidth: "60%",
        maxWidth: "70%",
    },
    suggestions: {
        backgroundColor: COLORS.white_transparent,
        padding: SIZES.spacing.sm,
        marginTop: 2,
        gap: SIZES.spacing.sm,
        borderRadius: SIZES.borderRadius.sm,
    },
    divider: {
        marginTop: SIZES.spacing.xs,
    },
});