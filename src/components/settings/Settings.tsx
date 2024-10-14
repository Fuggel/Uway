import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { MAP_STYLES } from "@/constants/map-constants";
import { SIZES } from "@/constants/size-constants";
import { SettingsContext } from "@/contexts/SettingsContext";
import { mapGasStationActions, mapGasStationSelectors } from "@/store/mapGasStation";
import { mapIncidentActions, mapIncidentSelectors } from "@/store/mapIncident";
import { mapParkAvailabilityActions, mapParkAvailabilitySelectors } from "@/store/mapParkAvailability";
import { mapSpeedCameraActions, mapSpeedCameraSelectors } from "@/store/mapSpeedCamera";
import { mapSpeedLimitActions, mapSpeedLimitSelectors } from "@/store/mapSpeedLimit";
import { mapViewActions, mapViewSelectors } from "@/store/mapView";
import { MapboxStyle } from "@/types/IMap";

import Dropdown from "../common/Dropdown";
import Switch from "../common/Switch";
import { SettingsItem, SettingsSection } from "./SettingsItem";

const Settings = () => {
    const { open, setOpen } = useContext(SettingsContext);
    const dispatch = useDispatch();
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
    const showSpeedCameras = useSelector(mapSpeedCameraSelectors.showSpeedCameras);
    const showIncidents = useSelector(mapIncidentSelectors.showIncident);
    const showSpeedLimits = useSelector(mapSpeedLimitSelectors.showSpeedLimit);
    const showParkAvailability = useSelector(mapParkAvailabilitySelectors.showParkAvailability);
    const showGasStations = useSelector(mapGasStationSelectors.showGasStation);

    if (!open) return null;

    return (
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
                            icon="map"
                            onChange={(val) => dispatch(mapViewActions.mapboxTheme(val as MapboxStyle))}
                        />
                    </SettingsItem>
                </SettingsSection>

                <SettingsSection title="Map Daten">
                    <SettingsItem title="Blitzer">
                        <Switch
                            checked={showSpeedCameras}
                            onChange={() => dispatch(mapSpeedCameraActions.setShowSpeedCameras(!showSpeedCameras))}
                        />
                    </SettingsItem>
                    <SettingsItem title="Verkehrsdaten">
                        <Switch
                            checked={showIncidents}
                            onChange={() => dispatch(mapIncidentActions.setShowIncident(!showIncidents))}
                        />
                    </SettingsItem>
                    <SettingsItem title="Geschwindigkeitsbegrenzungen">
                        <Switch
                            checked={showSpeedLimits}
                            onChange={() => dispatch(mapSpeedLimitActions.setShowSpeedLimit(!showSpeedLimits))}
                        />
                    </SettingsItem>
                    <SettingsItem title="Parkplätze & Parkhäuser">
                        <Switch
                            checked={showParkAvailability}
                            onChange={() =>
                                dispatch(mapParkAvailabilityActions.setShowParkAvailability(!showParkAvailability))
                            }
                        />
                    </SettingsItem>
                    <SettingsItem title="Tankstellen">
                        <Switch
                            checked={showGasStations}
                            onChange={() => dispatch(mapGasStationActions.setShowGasStation(!showGasStations))}
                        />
                    </SettingsItem>
                </SettingsSection>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        zIndex: 999999,
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
    },
});

export default Settings;
