import { Href, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { mapNavigationActions } from "@/store/mapNavigation";
import { mapSearchActions, mapSearchSelectors } from "@/store/mapSearch";
import { SavedSearchLocation, SearchLocation } from "@/types/ISearch";

import BottomSheetComponent from "@/components/common/BottomSheet";
import Divider from "@/components/common/Divider";
import IconButton from "@/components/common/IconButton";
import ListItem from "@/components/common/ListItem";
import Text from "@/components/common/Text";

interface SavedSearchesProps {
    handleLocationComplete: () => void;
}

const SavedSearches = ({ handleLocationComplete }: SavedSearchesProps) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const savedSearches = useSelector(mapSearchSelectors.savedSearches);
    const [bottomSheet, setBottomSheet] = useState<{ open: boolean; data: SavedSearchLocation | null } | null>(null);

    const handleLocationSearch = (search: SearchLocation) => {
        dispatch(mapNavigationActions.setLocation(search));
        handleLocationComplete();
    };

    return (
        <>
            <View style={styles.container}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.flexRow}>
                        {savedSearches?.map((search) => (
                            <Pressable
                                key={search.mapbox_id}
                                style={{ ...styles.iconButton, ...styles.savedButton }}
                                onPress={() => handleLocationSearch(search)}
                                onLongPress={() => setBottomSheet({ open: true, data: search })}
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

            {bottomSheet && bottomSheet.data && (
                <BottomSheetComponent onClose={() => setBottomSheet(null)} snapPoints={["100%"]} height="33%">
                    <View style={styles.bottomSheetContainer}>
                        <Text textStyle="header" type="white" style={{ marginBottom: SIZES.spacing.sm }}>
                            {bottomSheet.data.title}
                        </Text>

                        <ListItem
                            icon="pencil"
                            text="Ort bearbeiten"
                            color={COLORS.white}
                            type="white"
                            onPress={() => {
                                router.push("/(modal)/save-search" as Href);
                                dispatch(mapSearchActions.startEditingSearch(bottomSheet.data));
                            }}
                        />

                        <Divider st={{ marginVertical: SIZES.spacing.md }} />

                        <ListItem
                            icon="trash-can"
                            text="Ort löschen"
                            type="error"
                            color={COLORS.error}
                            onPress={() => {
                                dispatch(mapSearchActions.deleteSavedSearch(bottomSheet.data!.title as string));
                                setBottomSheet(null);
                            }}
                        />
                    </View>
                </BottomSheetComponent>
            )}
        </>
    );
};

export default SavedSearches;

const styles = StyleSheet.create({
    container: {
        marginTop: SIZES.spacing.lg,
        marginBottom: SIZES.spacing.sm,
        paddingHorizontal: SIZES.spacing.md,
    },
    flexRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: SIZES.spacing.sm,
    },
    bottomSheetContainer: {
        paddingHorizontal: SIZES.spacing.md,
        gap: SIZES.spacing.sm,
        height: "100%",
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
