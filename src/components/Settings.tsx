import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/colors-constants";
import { Divider, IconButton } from "react-native-paper";
import { SIZES } from "../constants/size-constants";
import Dropdown from "./Dropdown";
import { MapboxStyle } from "../types/IMap";
import { useDispatch, useSelector } from "react-redux";
import { mapViewActions, selectMapboxTheme } from "../store/mapView";

interface SettingsCommonProps {
    title?: string;
    children: React.ReactNode;
}

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
                                    onChange={(val) => dispatch(mapViewActions.mapboxTheme(val as MapboxStyle))}
                                    data={[
                                        { label: "Navigation Dark", value: MapboxStyle.NAVIGATION_DARK },
                                        { label: "Streets", value: MapboxStyle.STREET },
                                        { label: "Outdoors", value: MapboxStyle.OUTDOORS },
                                        { label: "Light", value: MapboxStyle.LIGHT },
                                        { label: "Dark", value: MapboxStyle.DARK },
                                        { label: "Satellite", value: MapboxStyle.SATELLITE },
                                        { label: "Satellite Streets", value: MapboxStyle.SATELLITE_STREET },
                                        { label: "Traffic Day", value: MapboxStyle.TRAFFIC_DAY },
                                        { label: "Traffic Night", value: MapboxStyle.TRAFFIC_NIGHT }
                                    ]}
                                />
                            </SettingsItem>
                        </SettingsSection>
                    </View>
                </View>
            }
        </>
    );
};

function SettingsItem({ title, children }: SettingsCommonProps) {
    return (
        <View style={styles.settingsItem}>
            <Text>{title}</Text>
            {children}
        </View>
    );
}

function SettingsSection({ title, children }: SettingsCommonProps) {
    return (
        <View style={styles.settingsSection}>
            <Text style={styles.heading}>{title}</Text>
            <Divider style={styles.divider} />
            {children}
        </View>
    );
}

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
    settingsSection: {
        marginVertical: SIZES.spacing.sm,
    },
    iconButton: {
        position: "absolute",
        top: 20,
        right: 10,
        zIndex: 999999,
    },
    heading: {
        fontSize: SIZES.fontSize.md,
    },
    divider: {
        marginTop: SIZES.spacing.xs,
    },
    settingsItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: SIZES.spacing.sm,
    }
});