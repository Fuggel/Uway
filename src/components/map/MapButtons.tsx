import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors-constants";
import { SIZES } from "../../constants/size-constants";
import { IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { mapNavigationActions, mapNavigationSelectors } from "../../store/mapNavigation";
import { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";
import { mapViewSelectors } from "@/src/store/mapView";
import { determineTheme, dynamicThemeStyles } from "@/src/utils/theme-utils";

const deviceHeight = Dimensions.get("window").height;

export default function MapButtons() {
    const dispatch = useDispatch();
    const { open, setOpen } = useContext(SettingsContext);
    const navigationView = useSelector(mapNavigationSelectors.navigationView);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);

    return (
        <View style={styles.container}>
            <View style={dynamicThemeStyles(styles.button, determineTheme(mapStyle))}>
                <TouchableOpacity>
                    <IconButton
                        icon="cog"
                        size={SIZES.iconSize.md}
                        iconColor={COLORS.primary}
                        onPress={() => setOpen(!open)}
                    />
                </TouchableOpacity>
            </View>

            <View style={dynamicThemeStyles(styles.button, determineTheme(mapStyle))}>
                <TouchableOpacity>
                    <IconButton
                        icon={"crosshairs-gps"}
                        size={SIZES.iconSize.md}
                        iconColor={COLORS.primary}
                        onPress={() => dispatch(mapNavigationActions.setTracking(true))}
                    />
                </TouchableOpacity>
            </View>

            <View style={dynamicThemeStyles(styles.button, determineTheme(mapStyle))}>
                <TouchableOpacity>
                    <IconButton
                        icon={navigationView ? "compass" : "navigation-variant"}
                        size={SIZES.iconSize.md}
                        iconColor={COLORS.primary}
                        onPress={() => dispatch(mapNavigationActions.setNavigationView(!navigationView))}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: deviceHeight > 1000 ? "4%" : "7%",
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
    }
});