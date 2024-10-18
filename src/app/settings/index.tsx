import { ScrollView, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { MAP_STYLES } from "@/constants/map-constants";
import { SIZES } from "@/constants/size-constants";
import { mapGasStationActions, mapGasStationSelectors } from "@/store/mapGasStation";
import { mapParkAvailabilityActions, mapParkAvailabilitySelectors } from "@/store/mapParkAvailability";
import { mapSpeedLimitActions, mapSpeedLimitSelectors } from "@/store/mapSpeedLimit";
import { mapTextToSpeechActions, mapTextToSpeechSelectors } from "@/store/mapTextToSpeech";
import { mapViewActions, mapViewSelectors } from "@/store/mapView";
import { MapboxStyle } from "@/types/IMap";

import Dropdown from "@/components/common/Dropdown";
import Link from "@/components/common/Link";
import Switch from "@/components/common/Switch";
import { SettingsItem, SettingsSection } from "@/components/settings/SettingsItem";

const Settings = () => {
    const dispatch = useDispatch();
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
    const showSpeedLimits = useSelector(mapSpeedLimitSelectors.showSpeedLimit);
    const showParkAvailability = useSelector(mapParkAvailabilitySelectors.showParkAvailability);
    const showGasStations = useSelector(mapGasStationSelectors.showGasStation);
    const allowTextToSpeech = useSelector(mapTextToSpeechSelectors.selectAllowTextToSpeech);

    return (
        <ScrollView style={styles.container}>
            <SettingsSection title="Allgemein">
                <SettingsItem title="Sprachausgabe">
                    <Switch
                        checked={allowTextToSpeech}
                        onChange={() => dispatch(mapTextToSpeechActions.setAllowTextToSpeech(!allowTextToSpeech))}
                    />
                </SettingsItem>
            </SettingsSection>

            <SettingsSection title="Map Daten">
                <SettingsItem title="Blitzer">
                    <Link to="/settings/speed-camera" />
                </SettingsItem>
                <SettingsItem title="Verkehrsdaten">
                    <Link to="/settings/incidents" />
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.white,
        padding: SIZES.spacing.md,
        zIndex: 999999,
    },
});

export default Settings;
