import { useRouter } from "expo-router";
import { useContext } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { OpenSheet, SheetType } from "@/types/ISheet";

import IconButton from "../common/IconButton";

const deviceHeight = Dimensions.get("window").height;

interface MapButtonsProps {
    openSheet: OpenSheet;
}

const MapButtons = ({ openSheet }: MapButtonsProps) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { userLocation } = useContext(UserLocationContext);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const tracking = useSelector(mapNavigationSelectors.tracking);

    return (
        <View style={styles.topRight}>
            {userLocation && !isNavigationMode && (
                <View style={styles.iconButton}>
                    <IconButton type="white" icon="magnify" onPress={() => openSheet({ type: SheetType.SEARCH })} />
                </View>
            )}

            <View style={styles.iconButton}>
                <IconButton type="white" icon="cog" onPress={() => router.push("/settings")} />
            </View>

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
    );
};

const styles = StyleSheet.create({
    topRight: {
        position: "absolute",
        top: deviceHeight > 1000 ? "4%" : "7%",
        right: SIZES.spacing.sm,
        gap: SIZES.spacing.sm,
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
