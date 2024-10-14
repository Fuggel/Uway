import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { SettingsContext } from "@/contexts/SettingsContext";
import { mapNavigationActions } from "@/store/mapNavigation";
import { mapViewSelectors } from "@/store/mapView";
import { determineTheme, dynamicThemeStyles } from "@/utils/theme-utils";

import Button from "../common/Button";

const MapButtons = () => {
    const dispatch = useDispatch();
    const { open, setOpen } = useContext(SettingsContext);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);

    return (
        <View style={styles.container}>
            <View style={dynamicThemeStyles(styles.button, determineTheme(mapStyle))}>
                <Button icon="crosshairs-gps" onPress={() => dispatch(mapNavigationActions.setTracking(true))} />
            </View>

            <View style={dynamicThemeStyles(styles.button, determineTheme(mapStyle))}>
                <Button icon="cog" onPress={() => setOpen(!open)} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: "2%",
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
