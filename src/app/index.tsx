import React, { useContext, useEffect, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Mapbox, { Camera, Images, MapView } from "@rnmapbox/maps";
import { Position } from "@turf/helpers";

import { MAP_CONFIG, MAP_ICONS } from "@/constants/map-constants";
import { MarkerBottomSheetContext } from "@/contexts/MarkerBottomSheetContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useDirections from "@/hooks/useDirections";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapViewSelectors } from "@/store/mapView";
import { GasStationNavigation } from "@/types/IGasStation";
import { MarkerSheet } from "@/types/ISheet";
import { determineMapStyle } from "@/utils/map-utils";
import { sheetData, sheetTitle } from "@/utils/sheet-utils";

import Loading from "@/components/common/Loading";
import Layers from "@/components/layer/Layers";
import MapAlerts from "@/components/map/MapAlerts";
import MapBottomSheet from "@/components/map/MapBottomSheet";
import MapButtons from "@/components/map/MapButtons";
import MapNavigation from "@/components/map/MapNavigation";

Mapbox.setAccessToken(MAP_CONFIG.accessToken);

const Map = () => {
    const dispatch = useDispatch();
    const { showSheet, markerData, closeSheet } = useContext(MarkerBottomSheetContext);
    const { userLocation } = useContext(UserLocationContext);
    const location = useSelector(mapNavigationSelectors.location);
    const tracking = useSelector(mapNavigationSelectors.tracking);
    const navigationView = useSelector(mapNavigationSelectors.navigationView);
    const navigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
    const [currentStep, setCurrentStep] = useState(0);
    const [gasStationAddress, setGasStationAddress] = useState<GasStationNavigation | null>({ address: "", place: "" });
    const { directions, setDirections, loadingDirections } = useDirections({
        destinationLngLat: {
            lon: location?.lon,
            lat: location?.lat,
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

    const handleGasStationPress = () => {
        const gasStationCoords = {
            lon: markerData?.properties?.lng,
            lat: markerData?.properties?.lat,
        };

        const street = markerData?.properties.street;
        const houseNumber = markerData?.properties.houseNumber || "";
        const postcode = markerData?.properties.postCode || "";
        const city = markerData?.properties.place || "";
        const country = "Deutschland";

        setGasStationAddress({
            address: `${street} ${houseNumber}`,
            place: `${postcode} ${city}, ${country}`,
        });

        console.log("Gas Station Address: ", gasStationCoords);

        closeSheet();
    };

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
                        gasStation={{
                            show: markerData?.type === MarkerSheet.GAS_STATION,
                            onPress: () => handleGasStationPress(),
                        }}
                    />
                )}
            </View>

            {(location || directions) && !showSheet && (
                <MapNavigation
                    directions={directions}
                    setDirections={setDirections}
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
