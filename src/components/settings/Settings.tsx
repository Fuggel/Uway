import { StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors-constants";
import { SIZES } from "../../constants/size-constants";
import Dropdown from "../common/Dropdown";
import { MapboxStyle } from "../../types/IMap";
import { useDispatch, useSelector } from "react-redux";
import { mapViewActions, mapViewSelectors } from "../../store/mapView";
import { SettingsItem, SettingsSection } from "./SettingsItem";
import { MAP_STYLES } from "../../constants/map-constants";
import { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";
import { IconButton, Switch } from "react-native-paper";
import { mapSpeedCameraActions, mapSpeedCameraSelectors } from "@/src/store/mapSpeedCamera";
import { mapParkAvailabilityActions, mapParkAvailabilitySelectors } from "@/src/store/mapParkAvailability";
import { mapSpeedLimitActions, mapSpeedLimitSelectors } from "@/src/store/mapSpeedLimit";

export default function Settings() {
    const dispatch = useDispatch();
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
    const showSpeedCameras = useSelector(mapSpeedCameraSelectors.showSpeedCameras);
    const showSpeedLimits = useSelector(mapSpeedLimitSelectors.showSpeedLimit);
    const showParkAvailability = useSelector(mapParkAvailabilitySelectors.showParkAvailability);
    const { open, setOpen } = useContext(SettingsContext);

    return (
        <>
            {open &&
                <View style={styles.container}>
                    <View style={styles.closeButton}>
                        <IconButton
                            icon="close-circle"
                            size={SIZES.iconSize.lg}
                            iconColor={COLORS.primary}
                            onPress={() => setOpen(false)}
                        />
                    </View>
                    <View style={styles.settings}>
                        <SettingsSection title="Map Style">
                            <SettingsItem>
                                <Dropdown
                                    value={mapStyle}
                                    data={MAP_STYLES}
                                    onChange={(val) => dispatch(mapViewActions.mapboxTheme(val as MapboxStyle))}
                                />
                            </SettingsItem>
                        </SettingsSection>

                        <SettingsSection title="Map Data">
                            <SettingsItem title="Show Speed Cameras">
                                <Switch
                                    value={showSpeedCameras}
                                    style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.1 }] }}
                                    thumbColor={showSpeedLimits ? COLORS.white : COLORS.white}
                                    trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                                    onValueChange={() => {
                                        dispatch(mapSpeedCameraActions.setShowSpeedCameras(!showSpeedCameras));
                                    }}
                                />
                            </SettingsItem>
                            <SettingsItem title="Show Speed Limits">
                                <Switch
                                    value={showSpeedLimits}
                                    style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.1 }] }}
                                    thumbColor={showSpeedLimits ? COLORS.white : COLORS.white}
                                    trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                                    onValueChange={() => {
                                        dispatch(mapSpeedLimitActions.setShowSpeedLimit(!showSpeedLimits));
                                    }}
                                />
                            </SettingsItem>
                            <SettingsItem title="Show Park Availablity">
                                <Switch
                                    value={showParkAvailability}
                                    style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.1 }] }}
                                    thumbColor={showSpeedLimits ? COLORS.white : COLORS.white}
                                    trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                                    onValueChange={() => {
                                        dispatch(mapParkAvailabilityActions.setShowParkAvailability(!showParkAvailability));
                                    }}
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
    closeButton: {
        position: "absolute",
        top: SIZES.spacing.lg,
        right: 0,
        zIndex: 999999,
    }
});