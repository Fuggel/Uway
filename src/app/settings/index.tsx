import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { MAP_STYLES } from "@/constants/map-constants";
import { SIZES } from "@/constants/size-constants";
import { mapGasStationActions, mapGasStationSelectors } from "@/store/mapGasStation";
import { mapTextToSpeechActions, mapTextToSpeechSelectors } from "@/store/mapTextToSpeech";
import { mapViewActions, mapViewSelectors } from "@/store/mapView";
import { MapboxStyle } from "@/types/IMap";

import Link from "@/components/common/Link";
import Switch from "@/components/common/Switch";
import Text from "@/components/common/Text";
import { SettingsItem, SettingsSection } from "@/components/settings/SettingsItem";

const Settings = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
    const showGasStations = useSelector(mapGasStationSelectors.showGasStation);
    const allowTextToSpeech = useSelector(mapTextToSpeechSelectors.selectAllowTextToSpeech);

    return (
        <>
            <StatusBar style="dark" />

            <ScrollView style={styles.container}>
                <SettingsSection icon="account-cog" title="Allgemein">
                    <SettingsItem title="Sprachausgabe">
                        <Switch
                            checked={allowTextToSpeech}
                            onChange={() => dispatch(mapTextToSpeechActions.setAllowTextToSpeech(!allowTextToSpeech))}
                        />
                    </SettingsItem>
                </SettingsSection>

                <SettingsSection icon="map-marker-multiple" title="Map Daten">
                    <SettingsItem title="Blitzer">
                        <Link type="secondary" to={() => router.push("/settings/speed-camera")} />
                    </SettingsItem>
                    <SettingsItem title="Verkehrsdaten">
                        <Link type="secondary" to={() => router.push("/settings/incidents")} />
                    </SettingsItem>
                    <SettingsItem title="Tankstellen">
                        <Switch
                            checked={showGasStations}
                            onChange={() => dispatch(mapGasStationActions.setShowGasStation(!showGasStations))}
                        />
                    </SettingsItem>
                </SettingsSection>

                <SettingsSection icon="map" title="Map Style">
                    <SettingsItem>
                        <View style={styles.mapStylesContainer}>
                            {MAP_STYLES.map((style) => (
                                <TouchableOpacity
                                    key={style.value}
                                    style={styles.imgContainer}
                                    activeOpacity={1}
                                    onPress={() => {
                                        if (mapStyle !== style.value) {
                                            dispatch(mapViewActions.mapboxTheme(style.value as MapboxStyle));
                                        }
                                    }}
                                >
                                    <Image
                                        source={style.img}
                                        style={[styles.img, mapStyle === style.value && styles.selectedMapStyle]}
                                    />
                                    <Text
                                        type={mapStyle === style.value ? "secondary" : "lightGray"}
                                        textStyle="caption"
                                    >
                                        {style.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </SettingsItem>
                </SettingsSection>
            </ScrollView>
        </>
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
    mapStylesContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "center",
        flexWrap: "wrap",
        gap: SIZES.spacing.lg,
    },
    imgContainer: {
        alignItems: "center",
        gap: SIZES.spacing.xs,
    },
    img: {
        width: 75,
        height: 75,
        borderRadius: SIZES.borderRadius.md,
    },
    selectedMapStyle: {
        borderWidth: 4,
        borderColor: COLORS.secondary,
        borderRadius: SIZES.borderRadius.md,
    },
});

export default Settings;
