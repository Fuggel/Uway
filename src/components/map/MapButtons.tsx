import { StyleSheet, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors-constants";
import { SIZES } from "../../constants/size-constants";
import { IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { mapNavigationActions, mapNavigationSelectors } from "../../store/mapNavigation";
import { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

export default function MapButtons() {
    const dispatch = useDispatch();
    const { open, setOpen } = useContext(SettingsContext);
    const navigationView = useSelector(mapNavigationSelectors.navigationView);

    return (
        <View style={styles.container}>
            <View style={styles.button}>
                <TouchableOpacity>
                    <IconButton
                        icon="cog"
                        size={SIZES.iconSize.lg}
                        iconColor={COLORS.primary}
                        onPress={() => setOpen(!open)}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.button}>
                <TouchableOpacity>
                    <IconButton
                        icon={"crosshairs-gps"}
                        size={SIZES.iconSize.lg}
                        iconColor={COLORS.primary}
                        onPress={() => dispatch(mapNavigationActions.setTracking(true))}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.button}>
                <TouchableOpacity>
                    <IconButton
                        icon={navigationView ? "compass" : "navigation-variant"}
                        size={SIZES.iconSize.lg}
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
        top: "4%",
        right: "4%",
        gap: SIZES.spacing.sm,
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.white_transparent,
        width: 50,
        height: 50,
        borderRadius: SIZES.borderRadius.sm,
    }
});