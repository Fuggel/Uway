import { StatusBar } from "expo-status-bar";
import { useContext, useEffect } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Mapbox, { Camera, Images, MapView } from "@rnmapbox/maps";

import { API_KEY } from "@/constants/env-constants";
import { DEFAULT_CAMERA_SETTINGS, MAP_ICONS } from "@/constants/map-constants";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { MapNavigationContext } from "@/contexts/MapNavigationContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useMapCamera from "@/hooks/useMapCamera";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapSearchActions, mapSearchSelectors } from "@/store/mapSearch";
import { mapViewSelectors } from "@/store/mapView";
import { MarkerSheet } from "@/types/ISheet";
import { determineMapStyle } from "@/utils/map-utils";
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
    const { directions, loadingDirections } = useContext(MapNavigationContext);
    const location = useSelector(mapNavigationSelectors.location);
    const recentSearches = useSelector(mapSearchSelectors.recentSearches);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);

    useEffect(() => {
        if (location) {
            dispatch(
                mapSearchActions.setRecentSearches(
                    [location, ...recentSearches.filter((loc) => loc.formatted !== location.formatted)].slice(0, 5)
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
