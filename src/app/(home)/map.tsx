import { useKeepAwake } from "expo-keep-awake";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Mapbox, { Camera, Images, MapView } from "@rnmapbox/maps";

import { API_KEY } from "@/constants/env-constants";
import { DEFAULT_CAMERA_SETTINGS, MAP_ICONS } from "@/constants/map-constants";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { MapFeatureContext } from "@/contexts/MapFeatureContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useMapCamera from "@/hooks/useMapCamera";
import useNavigation from "@/hooks/useNavigation";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapSearchActions, mapSearchSelectors } from "@/store/mapSearch";
import { mapViewSelectors } from "@/store/mapView";
import { mapWaypointActions } from "@/store/mapWaypoint";
import { GasStation } from "@/types/IGasStation";
import { LonLat } from "@/types/IMap";
import { MarkerSheet } from "@/types/ISheet";
import { determineMapStyle, getOrderedGasStations } from "@/utils/map-utils";
import { sheetData as openSheetData, sheetTitle } from "@/utils/sheet-utils";
import { determineTheme, invertTheme } from "@/utils/theme-utils";

import Loading from "@/components/common/Loading";
import Layers from "@/components/layer/Layers";
import MapAlerts from "@/components/map/MapAlerts";
import MapBottomSheet from "@/components/map/MapBottomSheet";
import MapButtons from "@/components/map/MapButtons";
import MapNavigation from "@/components/map/MapNavigation";

Mapbox.setAccessToken(API_KEY.MAPBOX_ACCESS_TOKEN);

const Map = () => {
    const dispatch = useDispatch();
    const { cameraRef } = useMapCamera();
    const { userLocation } = useContext(UserLocationContext);
    const { sheetData, showSheet, closeSheet } = useContext(BottomSheetContext);
    const { gasStations } = useContext(MapFeatureContext);
    const { loadingDirections } = useNavigation();
    const directions = useSelector(mapNavigationSelectors.directions);
    const location = useSelector(mapNavigationSelectors.location);
    const recentSearches = useSelector(mapSearchSelectors.recentSearches);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);

    useKeepAwake();

    useEffect(() => {
        if (location) {
            dispatch(
                mapSearchActions.setRecentSearches(
                    [
                        location,
                        ...recentSearches.filter((loc) => {
                            if (loc.mapbox_id) {
                                return loc.mapbox_id !== location.mapbox_id;
                            }

                            return loc.default_id !== location.default_id;
                        }),
                    ].slice(0, 5)
                )
            );
        }
    }, [location]);

    return (
        <>
            <StatusBar style={invertTheme(determineTheme(mapStyle))} />

            <View style={styles.container}>
                {loadingDirections && <Loading />}

                <MapView
                    style={styles.map}
                    styleURL={determineMapStyle(mapStyle)}
                    scaleBarEnabled={false}
                    onTouchStart={() => {
                        Keyboard.dismiss();
                        dispatch(mapNavigationActions.setTracking(false));
                        dispatch(mapNavigationActions.setNavigationView(false));
                    }}
                >
                    <Images images={MAP_ICONS} />

                    <Camera ref={cameraRef} defaultSettings={DEFAULT_CAMERA_SETTINGS} />

                    <Layers />
                </MapView>

                <MapButtons />

                {userLocation && <MapAlerts />}

                {showSheet && (
                    <MapBottomSheet
                        onClose={closeSheet}
                        markerProps={{
                            title: sheetTitle(sheetData?.markerType, sheetData?.markerProperties),
                            data: openSheetData(sheetData?.markerType, sheetData?.markerProperties),
                            gasStation: {
                                show: sheetData?.markerType === MarkerSheet.GAS_STATION,
                            },
                        }}
                        waypointProps={{
                            data: getOrderedGasStations(
                                gasStations.gasStations?.features.map((feature) => feature.properties as GasStation)
                            ),
                            onSelect: (coords: LonLat) => {
                                dispatch(mapWaypointActions.setSelectGasStationWaypoint(false));
                                dispatch(mapWaypointActions.setGasStationWaypoints(coords));
                                closeSheet();
                            },
                        }}
                    />
                )}
            </View>

            {location && directions && <MapNavigation />}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    map: {
        flex: 1,
    },
});

export default Map;
