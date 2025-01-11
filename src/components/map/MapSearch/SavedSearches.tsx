import { Href, useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

import IconButton from "@/components/common/IconButton";

const SavedSearches = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.flexRow}>
                    <View style={styles.iconButton}>
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
        gap: SIZES.spacing.xs,
    },
    iconButton: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        width: SIZES.iconSize.xl,
        height: SIZES.iconSize.xl,
        borderRadius: SIZES.borderRadius.md,
    },
});
