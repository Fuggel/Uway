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
import { mapTestingActions, mapTestingSelectors } from "@/src/store/mapTesting";
import { TESTING_ROUTES } from "@/src/constants/route-testing-constants";
import { Route } from "@/src/types/IMock";
import { mapChargingStationActions, mapChargingStationSelectors } from "@/src/store/mapChargingStation";
import { mapGasStationActions, mapGasStationSelectors } from "@/src/store/mapGasStation";

export default function Settings() {
    const dispatch = useDispatch();
    const simulateRoute = useSelector(mapTestingSelectors.simulateRoute);
    const selectedRoute = useSelector(mapTestingSelectors.selectedRoute);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
    const showSpeedCameras = useSelector(mapSpeedCameraSelectors.showSpeedCameras);
    const showSpeedLimits = useSelector(mapSpeedLimitSelectors.showSpeedLimit);
    const showParkAvailability = useSelector(mapParkAvailabilitySelectors.showParkAvailability);
    const showChargingStations = useSelector(mapChargingStationSelectors.showChargingStation);
    const showGasStations = useSelector(mapGasStationSelectors.showGasStation);
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
                        {process.env.NODE_ENV === "development" && (
                            <SettingsSection title="Dev Testing">
                                <SettingsItem title="Route simulieren">
                                    <Switch
                                        value={simulateRoute}
                                        thumbColor={simulateRoute ? COLORS.white : COLORS.white}
                                        trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                                        onValueChange={() => {
                                            dispatch(mapTestingActions.setSimulateRoute(!simulateRoute));
                                        }}
                                    />
                                </SettingsItem>
                                {simulateRoute && (
                                    <SettingsItem>
                                        <Dropdown
                                            value={selectedRoute}
                                            data={TESTING_ROUTES}
                                            icon="routes"
                                            onChange={(val) => {
                                                dispatch(mapTestingActions.setSelectedRoute(val as Route));
                                            }}
                                        />
                                    </SettingsItem>
                                )}
                            </SettingsSection>
                        )}

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
                                    value={showSpeedCameras}
                                    thumbColor={showSpeedCameras ? COLORS.white : COLORS.white}
                                    trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                                    onValueChange={() => {
                                        dispatch(mapSpeedCameraActions.setShowSpeedCameras(!showSpeedCameras));
                                    }}
                                />
                            </SettingsItem>
                            <SettingsItem title="Geschwindigkeitsbegrenzungen">
                                <Switch
                                    value={showSpeedLimits}
                                    thumbColor={showSpeedLimits ? COLORS.white : COLORS.white}
                                    trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                                    onValueChange={() => {
                                        dispatch(mapSpeedLimitActions.setShowSpeedLimit(!showSpeedLimits));
                                    }}
                                />
                            </SettingsItem>
                            <SettingsItem title="Parkplätze & Parkhäuser">
                                <Switch
                                    value={showParkAvailability}
                                    thumbColor={showParkAvailability ? COLORS.white : COLORS.white}
                                    trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                                    onValueChange={() => {
                                        dispatch(mapParkAvailabilityActions.setShowParkAvailability(!showParkAvailability));
                                    }}
                                />
                            </SettingsItem>
                            <SettingsItem title="E-Ladestationen">
                                <Switch
                                    value={showChargingStations}
                                    thumbColor={showChargingStations ? COLORS.white : COLORS.white}
                                    trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                                    onValueChange={() => {
                                        dispatch(mapChargingStationActions.setShowChargingStation(!showChargingStations));
                                    }}
                                />
                            </SettingsItem>
                            <SettingsItem title="Tankstellen">
                                <Switch
                                    value={showGasStations}
                                    thumbColor={showGasStations ? COLORS.white : COLORS.white}
                                    trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                                    onValueChange={() => {
                                        dispatch(mapGasStationActions.setShowGasStation(!showGasStations));
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