import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { mapLayoutsActions, mapLayoutsSelectors } from "@/store/mapLayouts";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { SheetType } from "@/types/ISheet";

import IconButton from "../common/IconButton";

const deviceHeight = Dimensions.get("window").height;

const MapButtons = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { userLocation } = useContext(UserLocationContext);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const tracking = useSelector(mapNavigationSelectors.tracking);
    const selectingCategoryLocation = useSelector(mapLayoutsSelectors.selectingCategoryLocation);
    const openGasStationsList = useSelector(mapLayoutsSelectors.openGasStationsList);
    const { openSheet, closeSheet } = useContext(BottomSheetContext);

    const getTopOffset = () => {
        if (deviceHeight > 1000) {
            return isNavigationMode ? "16%" : "4%";
        } else {
            return isNavigationMode ? "22%" : "7%";
        }
    };

    return (
        <>
            {selectingCategoryLocation && (
                <View style={{ ...styles.topLeft, top: getTopOffset() }}>
                    <View style={styles.iconButton}>
                        <IconButton
                            type="white"
                            icon="arrow-left"
                            onPress={() => {
                                dispatch(mapLayoutsActions.setSelectingCategoryLocation(false));
                                dispatch(mapNavigationActions.setCategoryLocation(null));
                                closeSheet();
                            }}
                        />
                    </View>
                </View>
            )}

            <View style={{ ...styles.topRight, top: getTopOffset() }}>
                {userLocation && !isNavigationMode && (
                    <View style={styles.iconButton}>
                        <IconButton type="white" icon="magnify" onPress={() => router.push("/(modal)/search")} />
                    </View>
                )}

                <View style={styles.iconButton}>
                    <IconButton type="white" icon="cog" onPress={() => router.push("/settings")} />
                </View>

                {!openGasStationsList && !isNavigationMode && (
                    <View style={styles.iconButton}>
                        <IconButton
                            type="white"
                            icon="gas-station"
                            onPress={() => {
                                dispatch(mapLayoutsActions.setOpenGasStationsList(true));
                                openSheet({ type: SheetType.GAS_STATION_LIST });
                            }}
                        />
                    </View>
                )}

                {!tracking && (
                    <View style={styles.iconButton}>
                        <IconButton
                            type="white"
                            icon="crosshairs-gps"
                            onPress={() => dispatch(mapNavigationActions.setTracking(true))}
                        />
                    </View>
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    topRight: {
        position: "absolute",
        right: SIZES.spacing.sm,
        gap: SIZES.spacing.xs,
    },
    topLeft: {
        position: "absolute",
        left: SIZES.spacing.sm,
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

export default MapButtons;
