import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { TouchableOpacity } from "@gorhom/bottom-sheet";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { MapFeatureContext } from "@/contexts/MapFeatureContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { mapExcludeNavigationSelectors } from "@/store/mapExcludeNavigation";
import { mapLayoutsActions, mapLayoutsSelectors } from "@/store/mapLayouts";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { ExcludeTypes } from "@/types/INavigation";
import { SheetType } from "@/types/ISheet";

import CircleSeparator from "../common/CircleSeparator";
import IconButton from "../common/IconButton";
import Text from "../common/Text";

const deviceHeight = Dimensions.get("window").height;

const MapButtons = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { userLocation } = useContext(UserLocationContext);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const isNavigationSelecting = useSelector(mapNavigationSelectors.isNavigationSelecting);
    const excludeTypes = useSelector(mapExcludeNavigationSelectors.excludeTypes);
    const tracking = useSelector(mapNavigationSelectors.tracking);
    const selectingCategoryLocation = useSelector(mapLayoutsSelectors.selectingCategoryLocation);
    const openGasStationsList = useSelector(mapLayoutsSelectors.openGasStationsList);
    const { openSheet, closeSheet } = useContext(BottomSheetContext);
    const { gasStations } = useContext(MapFeatureContext);
    const direction = useSelector(mapNavigationSelectors.directions);
    const routeOptions = useSelector(mapNavigationSelectors.routeOptions);

    const excludeTypesLength = Object.keys(excludeTypes).filter(
        (key) => excludeTypes[key as keyof ExcludeTypes]
    ).length;

    const getTopOffset = () => {
        if (deviceHeight > 1000) {
            return isNavigationMode ? "16%" : "4%";
        } else {
            return isNavigationMode ? "22%" : "7%";
        }
    };

    return (
        <>
            <View style={{ ...styles.topLeft, top: getTopOffset() }}>
                {selectingCategoryLocation && (
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
                )}

                {isNavigationSelecting && !!direction && !!routeOptions && (
                    <TouchableOpacity
                        style={styles.excludeButton}
                        activeOpacity={0.9}
                        onPress={() => router.push("/settings/navigation")}
                    >
                        <Text type="white">Vermeiden</Text>

                        {excludeTypesLength > 0 && (
                            <>
                                <CircleSeparator />
                                <View style={styles.excludeBadge}>
                                    <Text type="white">{excludeTypesLength}</Text>
                                </View>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            <View style={{ ...styles.topRight, top: getTopOffset() }}>
                {userLocation && !isNavigationMode && (
                    <View style={styles.iconButton}>
                        <IconButton type="white" icon="magnify" onPress={() => router.push("/(modal)/search")} />
                    </View>
                )}

                <View style={styles.iconButton}>
                    <IconButton type="white" icon="cog" onPress={() => router.push("/settings")} />
                </View>

                {!openGasStationsList && !isNavigationMode && !!gasStations?.gasStations?.features?.length && (
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
    excludeButton: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.borderRadius.md,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SIZES.spacing.md,
        paddingVertical: SIZES.spacing.sm,
    },
    excludeBadge: {
        backgroundColor: COLORS.secondary,
        borderRadius: 1000,
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
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
