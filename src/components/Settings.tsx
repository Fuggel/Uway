import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../constants/colors-constants";
import { IconButton } from "react-native-paper";
import { SIZES } from "../constants/size-constants";
import Dropdown from "./Dropdown";
import { MapboxStyle } from "../types/IMap";
import { useDispatch, useSelector } from "react-redux";
import { mapViewActions, selectMapboxTheme } from "../store/mapView";
import { SettingsItem, SettingsSection } from "./SettingsItem";
import { mapStyles } from "../constants/map-constants";

export default function Settings() {
    const dispatch = useDispatch();
    const mapStyle = useSelector(selectMapboxTheme);
    const [openSettings, setOpenSettings] = useState(false);

    return (
        <>
            <IconButton
                icon="cog"
                size={SIZES.iconSize.md}
                style={styles.iconButton}
                iconColor={COLORS.primary}
                onPress={() => setOpenSettings((prev) => !prev)}
            />

            {openSettings &&
                <View style={styles.container}>
                    <View style={styles.settings}>
                        <SettingsSection title="Map">
                            <SettingsItem>
                                <Dropdown
                                    value={mapStyle}
                                    data={mapStyles}
                                    onChange={(val) => dispatch(mapViewActions.mapboxTheme(val as MapboxStyle))}
                                />
                            </SettingsItem>
                        </SettingsSection>
                    </View>
                </View>
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.white,
    },
    settings: {
        marginTop: SIZES.spacing.lg,
        padding: SIZES.spacing.md,
    },
    iconButton: {
        position: "absolute",
        top: 20,
        right: 10,
        zIndex: 999999,
    },
});