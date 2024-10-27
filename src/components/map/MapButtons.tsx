import { useRouter } from "expo-router";
import { useContext } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapViewSelectors } from "@/store/mapView";
import { determineTheme, dynamicThemeStyles } from "@/utils/theme-utils";

import Button from "../common/Button";

const deviceHeight = Dimensions.get("window").height;

interface MapButtonsProps {
    openMapSearch: () => void;
}

const MapButtons = ({ openMapSearch }: MapButtonsProps) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { userLocation } = useContext(UserLocationContext);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);

    return (
        <View style={styles.container}>
            {userLocation && !isNavigationMode && (
                <View style={dynamicThemeStyles(styles.button, determineTheme(mapStyle))}>
                    <Button icon="magnify" onPress={openMapSearch} />
                </View>
            )}
            <View style={dynamicThemeStyles(styles.button, determineTheme(mapStyle))}>
                <Button icon="crosshairs-gps" onPress={() => dispatch(mapNavigationActions.setTracking(true))} />
            </View>

            <View style={dynamicThemeStyles(styles.button, determineTheme(mapStyle))}>
                <Button icon="cog" onPress={() => router.push("/settings")} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: deviceHeight > 1000 ? "2%" : "4%",
        right: SIZES.spacing.sm,
        gap: SIZES.spacing.sm,
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.white_transparent,
        width: SIZES.iconSize.xl,
        height: SIZES.iconSize.xl,
        borderRadius: SIZES.borderRadius.sm,
    },
});

export default MapButtons;
