import { useRouter } from "expo-router";
import { useContext } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapViewSelectors } from "@/store/mapView";
import { OpenSheet } from "@/types/IMap";
import { determineTheme, dynamicThemeStyles } from "@/utils/theme-utils";

import Button from "../common/Button";
import IconButton from "../common/IconButton";

const deviceHeight = Dimensions.get("window").height;

interface MapButtonsProps {
    setOpen: React.Dispatch<React.SetStateAction<OpenSheet>>;
}

const MapButtons = ({ setOpen }: MapButtonsProps) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { userLocation } = useContext(UserLocationContext);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);

    return (
        <>
            <View style={styles.topRight}>
                {userLocation && !isNavigationMode && (
                    <View style={dynamicThemeStyles(styles.iconButton, determineTheme(mapStyle))}>
                        <IconButton icon="magnify" onPress={() => setOpen((prev) => ({ ...prev, search: true }))} />
                    </View>
                )}

                <View style={dynamicThemeStyles(styles.iconButton, determineTheme(mapStyle))}>
                    <IconButton icon="cog" onPress={() => router.push("/settings")} />
                </View>

                <View style={dynamicThemeStyles(styles.iconButton, determineTheme(mapStyle))}>
                    <IconButton
                        icon="crosshairs-gps"
                        onPress={() => dispatch(mapNavigationActions.setTracking(true))}
                    />
                </View>
            </View>

            <View style={styles.bottomRight}>
                {userLocation && (
                    <Button
                        st={styles.button}
                        icon={require("../../assets/images/map-icons/add.png")}
                        onPress={() => setOpen((prev) => ({ ...prev, speedCamera: true }))}
                    />
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    topRight: {
        position: "absolute",
        top: deviceHeight > 1000 ? "4%" : "7%",
        right: SIZES.spacing.sm,
        gap: SIZES.spacing.sm,
    },
    bottomRight: {
        position: "absolute",
        bottom: deviceHeight > 1000 ? "2%" : "4%",
        right: SIZES.spacing.sm,
        gap: SIZES.spacing.sm,
    },
    iconButton: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.white_transparent,
        width: SIZES.iconSize.xl,
        height: SIZES.iconSize.xl,
        borderRadius: SIZES.borderRadius.sm,
    },
    button: {
        width: SIZES.iconSize.xxl,
        height: SIZES.iconSize.xxl,
    },
});

export default MapButtons;
