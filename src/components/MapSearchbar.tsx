import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import Searchbar from "./Searchbar";
import { Divider } from "react-native-paper";
import { Suggestion } from "../types/IMap";
import { SIZES } from "../constants/size-constants";
import { COLORS } from "../constants/colors-constants";

interface MapSearchbarProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    suggestions: Suggestion | null;
    setLocationId: React.Dispatch<React.SetStateAction<string>>;
}

export default function MapSearchbar({
    searchQuery,
    setSearchQuery,
    suggestions,
    setLocationId,
}: MapSearchbarProps) {
    return (
        <Searchbar
            st={styles.search}
            listSt={styles.suggestions}
            placeholder="Search for a location"
            onChangeText={setSearchQuery}
            value={searchQuery}
        >
            {suggestions?.suggestions
                .filter(suggestion => suggestion.full_address)
                .map((suggestion) => (
                    <ScrollView key={suggestion.mapbox_id}>
                        <TouchableOpacity onPress={() => setLocationId(suggestion.mapbox_id)}>
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
        top: SIZES.spacing.xl,
        left: SIZES.spacing.md,
        width: "50%",
    },
    suggestions: {
        backgroundColor: COLORS.white_transparent,
        padding: SIZES.spacing.sm,
        marginTop: 2,
        gap: SIZES.spacing.sm,
        borderRadius: SIZES.borderRadius.sm,
        width: "95%",
        marginHorizontal: "auto",
    },
    divider: {
        marginTop: SIZES.spacing.xs,
    },
});