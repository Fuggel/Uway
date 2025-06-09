import { useKeepAwake } from "expo-keep-awake";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import Mapbox, { Camera, Images, MapView } from "@rnmapbox/maps";

import { COLORS } from "@/constants/colors-constants";
import { API } from "@/constants/env-constants";
import { DEFAULT_CAMERA_SETTINGS, MAP_ICONS } from "@/constants/map-constants";
import { SIZES } from "@/constants/size-constants";
import { AuthContext } from "@/contexts/AuthContext";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useBackgroundService from "@/hooks/useBackgroundService";
import useMapCamera from "@/hooks/useMapCamera";
import useNavigation from "@/hooks/useNavigation";
import { mapExcludeNavigationSelectors } from "@/store/mapExcludeNavigation";
import { mapIncidentSelectors } from "@/store/mapIncident";
import { mapLayoutsActions, mapLayoutsSelectors } from "@/store/mapLayouts";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapSearchActions, mapSearchSelectors } from "@/store/mapSearch";
import { mapSpeedCameraSelectors } from "@/store/mapSpeedCamera";
import { mapTextToSpeechSelectors } from "@/store/mapTextToSpeech";
import { mapViewSelectors } from "@/store/mapView";
import { RouteProfileType } from "@/types/INavigation";
import { SearchLocation } from "@/types/ISearch";
import { MarkerSheet, SheetType } from "@/types/ISheet";
import { determineMapStyle, prepareExludeTypes } from "@/utils/map-utils";
import { sheetData as openSheetData, sheetTitle } from "@/utils/sheet-utils";
import { determineTheme, invertTheme } from "@/utils/theme-utils";

import BottomSheetComponent from "@/components/common/BottomSheet";
import Button from "@/components/common/Button";
import Loading from "@/components/common/Loading";
import Text from "@/components/common/Text";
import Layers from "@/components/layer/Layers";
import MapAlerts from "@/components/map/MapAlerts";
import MapBottomSheet from "@/components/map/MapBottomSheet/MapBottomSheet";
import RouteOptions from "@/components/map/MapBottomSheet/RouteOptions";
import MapButtons from "@/components/map/MapButtons";
import MapNavigation from "@/components/map/MapNavigation";

Mapbox.setAccessToken(API.MAPBOX_ACCESS_TOKEN);

const Map = () => {
    const dispatch = useDispatch();
    const { cameraRef } = useMapCamera();
    const { authToken } = useContext(AuthContext);
    const { userLocation } = useContext(UserLocationContext);
    const { openSheet, sheetData, showSheet, closeSheet } = useContext(BottomSheetContext);
    const categoryLocations = useSelector(mapNavigationSelectors.categoryLocation);
    const showRouteOptions = useSelector(mapNavigationSelectors.showRouteOptions);
    const routeOptions = useSelector(mapNavigationSelectors.routeOptions);
    const selectedRoute = useSelector(mapNavigationSelectors.selectedRoute);
    const excludeTypes = useSelector(mapExcludeNavigationSelectors.excludeTypes);
    const { loadingDirections, errorDirections, isQueryEnabled } = useNavigation();
    const directions = useSelector(mapNavigationSelectors.directions);
    const location = useSelector(mapNavigationSelectors.location);
    const recentSearches = useSelector(mapSearchSelectors.recentSearches);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const isNavigationSelecting = useSelector(mapNavigationSelectors.isNavigationSelecting);
    const selectingCategoryLocation = useSelector(mapLayoutsSelectors.selectingCategoryLocation);
    const allowTextToSpeech = useSelector(mapTextToSpeechSelectors.selectAllowTextToSpeech);
    const showIncidents = useSelector(mapIncidentSelectors.showIncident);
    const playIncidentAcousticWarning = useSelector(mapIncidentSelectors.playAcousticWarning);
    const showSpeedCameras = useSelector(mapSpeedCameraSelectors.showSpeedCameras);
    const playSpeedCameraAcousticWarning = useSelector(mapSpeedCameraSelectors.playAcousticWarning);

    useKeepAwake();

    useBackgroundService({
        isNavigationEnabled: isNavigationMode,
        authToken: String(authToken?.token),
        destinationCoordinates: `${location?.coordinates.longitude},${location?.coordinates.latitude}`,
        exclude: prepareExludeTypes(excludeTypes),
        profileType: RouteProfileType.DRIVING,
        selectedRoute,
        allowTextToSpeech,
        incidentOptions: {
            showIncidents,
            playAcousticWarning: playIncidentAcousticWarning,
        },
        speedCameraOptions: {
            showSpeedCameras,
            playAcousticWarning: playSpeedCameraAcousticWarning,
        },
    });

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

                            return loc.default_id !== location.default_id && loc.name !== location.name;
                        }),
                    ].slice(0, 5)
                )
            );
        }
    }, [location]);

    useEffect(() => {
        if (isNavigationSelecting && (errorDirections || !isQueryEnabled)) {
            dispatch(mapNavigationActions.setIsNavigationSelecting(false));
            dispatch(mapLayoutsActions.setSelectingCategoryLocation(false));
            dispatch(mapNavigationActions.setShowRouteOptions(false));

            Toast.show({
                type: "error",
                text1: "Fehler",
                text2: "Fehler beim Abrufen der Route.",
            });
        }
    }, [isNavigationSelecting, errorDirections, isQueryEnabled]);

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
                        poiProps={{
                            data: categoryLocations?.features.map((feature) => feature.properties),
                            onSelect: (newLocation: SearchLocation) => {
                                dispatch(mapNavigationActions.setLocation(newLocation));
                                dispatch(mapLayoutsActions.setSelectingCategoryLocation(false));
                                dispatch(mapNavigationActions.setCategoryLocation(null));
                                dispatch(mapNavigationActions.setDirectNavigation(true));
                                dispatch(mapNavigationActions.setIsNavigationMode(true));
                                dispatch(mapNavigationActions.setTracking(true));
                                dispatch(mapNavigationActions.setIsNavigationSelecting(false));
                                dispatch(mapNavigationActions.setRouteOptions(null));
                                dispatch(mapNavigationActions.setSelectedRoute(0));
                                closeSheet();
                            },
                        }}
                    />
                )}

                {!showSheet && selectingCategoryLocation && (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.showListContainer}
                        onPress={() => {
                            openSheet({ type: SheetType.POI });
                            dispatch(mapLayoutsActions.setOpenCategoryLocationsList(true));
                        }}
                    >
                        <View style={styles.showList}>
                            <Button icon="chevron-up" />
                            <Text style={{ textAlign: "center" }}>Liste anzeigen</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>

            {showRouteOptions && routeOptions && (
                <BottomSheetComponent onClose={() => dispatch(mapNavigationActions.handleCancelNavigation())}>
                    <RouteOptions />
                </BottomSheetComponent>
            )}

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
    showListContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        padding: SIZES.spacing.sm,
        borderTopLeftRadius: SIZES.borderRadius.md,
        borderTopRightRadius: SIZES.borderRadius.md,
        zIndex: 999999,
    },
    showList: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Map;
