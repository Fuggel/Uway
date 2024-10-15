import React, { useContext, useEffect, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Mapbox, { Camera, Images, MapView } from "@rnmapbox/maps";
import { Position } from "@turf/helpers";

import { sessionToken } from "@/constants/auth-constants";
import { MAP_CONFIG, MAP_ICONS } from "@/constants/map-constants";
import { MarkerBottomSheetContext } from "@/contexts/MarkerBottomSheetContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useDirections from "@/hooks/useDirections";
import useSearchLocation from "@/hooks/useSearchLocation";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapViewSelectors } from "@/store/mapView";
import { determineMapStyle } from "@/utils/map-utils";
import { sheetData, sheetTitle } from "@/utils/sheet-utils";

import Loading from "../common/Loading";
import Layers from "../layer/Layers";
import MapAlerts from "./MapAlerts";
import MapBottomSheet from "./MapBottomSheet";
import MapButtons from "./MapButtons";
import MapNavigation from "./MapNavigation";

Mapbox.setAccessToken(MAP_CONFIG.accessToken);

const Map = () => {
    const dispatch = useDispatch();
    const { showSheet, markerData, closeSheet } = useContext(MarkerBottomSheetContext);
    const { userLocation } = useContext(UserLocationContext);
    const locationId = useSelector(mapNavigationSelectors.locationId);
    const tracking = useSelector(mapNavigationSelectors.tracking);
    const navigationView = useSelector(mapNavigationSelectors.navigationView);
    const navigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
    const [currentStep, setCurrentStep] = useState(0);
    const { locations, setLocations } = useSearchLocation({ mapboxId: locationId, sessionToken });
    const { directions, setDirections, loadingDirections } = useDirections({
        destinationLngLat: {
            lon: locations?.geometry?.coordinates[0] as number,
            lat: locations?.geometry?.coordinates[1] as number,
        },
        setCurrentStep,
    });

    const defaultSettings = {
        centerCoordinate: !userLocation
            ? ([MAP_CONFIG.position.lon, MAP_CONFIG.position.lat] as Position)
            : ([userLocation.coords.longitude, userLocation.coords.latitude] as Position),
        zoomLevel: !userLocation ? MAP_CONFIG.noLocationZoom : MAP_CONFIG.zoom,
        pitch: MAP_CONFIG.pitch,
    };

    useEffect(() => {
        if (tracking && navigationMode && !navigationView) {
            dispatch(mapNavigationActions.setNavigationView(true));
        }
    }, [tracking, navigationMode, navigationView]);

    return (
        <>
            <View style={styles.container}>
                {loadingDirections && <Loading />}

                <MapView
                    logoEnabled={false}
                    attributionEnabled={false}
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

                    <Camera
                        animationDuration={500}
                        animationMode="linearTo"
                        pitch={navigationView ? MAP_CONFIG.followPitch : MAP_CONFIG.pitch}
                        heading={tracking || navigationView ? userLocation?.coords.heading : undefined}
                        zoomLevel={
                            !userLocation
                                ? MAP_CONFIG.noLocationZoom
                                : navigationView
                                  ? MAP_CONFIG.followZoom
                                  : MAP_CONFIG.zoom
                        }
                        centerCoordinate={
                            userLocation && (tracking || navigationView)
                                ? ([userLocation.coords.longitude, userLocation.coords.latitude] as Position)
                                : tracking && !userLocation
                                  ? ([MAP_CONFIG.position.lon, MAP_CONFIG.position.lat] as Position)
                                  : undefined
                        }
                        defaultSettings={defaultSettings}
                    />

                    <Layers directions={directions} />
                </MapView>

                <MapButtons />

                <MapAlerts directions={directions} currentStep={currentStep} />

                {showSheet && (
                    <MapBottomSheet
                        title={sheetTitle(markerData?.type, markerData?.properties)}
                        data={sheetData(markerData?.type, markerData?.properties)}
                        onClose={closeSheet}
                    />
                )}
            </View>

            {(locations || directions) && !showSheet && (
                <MapNavigation
                    directions={directions}
                    locations={locations}
                    setDirections={setDirections}
                    setLocations={setLocations}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                />
            )}
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
