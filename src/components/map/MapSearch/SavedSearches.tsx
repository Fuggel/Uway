import { Href, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { mapNavigationActions } from "@/store/mapNavigation";
import { mapSearchSelectors } from "@/store/mapSearch";
import { SearchLocation } from "@/types/ISearch";

import IconButton from "@/components/common/IconButton";
import Text from "@/components/common/Text";

interface SavedSearchesProps {
    handleLocationComplete: () => void;
}

const SavedSearches = ({ handleLocationComplete }: SavedSearchesProps) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const savedSearches = useSelector(mapSearchSelectors.savedSearches);

    const handleLocationSearch = (search: SearchLocation) => {
        dispatch(mapNavigationActions.setLocation(search));
        handleLocationComplete();
    };

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.flexRow}>
                    {savedSearches?.map((search) => (
                        <Pressable
                            key={search.mapbox_id}
                            style={{ ...styles.iconButton, ...styles.savedButton }}
                            onPress={() => handleLocationSearch(search)}
                            onLongPress={() => console.log("Long Pressed")}
                        >
                            <Text type="gray">{search.title}</Text>
                        </Pressable>
                    ))}

                    <View style={{ ...styles.iconButton, ...styles.addNewButton }}>
                        <IconButton
                            type="white"
                            icon="plus"
                            onPress={() => router.push("/(modal)/save-search" as Href)}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default SavedSearches;

const styles = StyleSheet.create({
    container: {
        marginTop: SIZES.spacing.md,
        marginBottom: SIZES.spacing.sm,
        paddingHorizontal: SIZES.spacing.sm,
    },
    flexRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: SIZES.spacing.sm,
    },
    iconButton: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: SIZES.borderRadius.md,
    },
    savedButton: {
        backgroundColor: COLORS.white,
        paddingHorizontal: SIZES.spacing.md,
        height: SIZES.iconSize.xl,
    },
    addNewButton: {
        backgroundColor: COLORS.primary,
        width: SIZES.iconSize.xl,
        height: SIZES.iconSize.xl,
    },
});
