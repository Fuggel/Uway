import { useContext, useEffect, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Mapbox, { Camera, Images, MapView } from "@rnmapbox/maps";
import { useMutation } from "@tanstack/react-query";
import { Position } from "@turf/helpers";

import { MAP_CONFIG, MAP_ICONS } from "@/constants/map-constants";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useNavigation from "@/hooks/useNavigation";
import { reportSpeedCamera } from "@/services/speed-cameras";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapSearchActions, mapSearchSelectors } from "@/store/mapSearch";
import { mapViewSelectors } from "@/store/mapView";
import { MarkerSheet } from "@/types/ISheet";
import { determineMapStyle } from "@/utils/map-utils";
import { sheetData as openSheetData, sheetTitle } from "@/utils/sheet-utils";

import Loading from "@/components/common/Loading";
import Layers from "@/components/layer/Layers";
import MapAlerts from "@/components/map/MapAlerts";
import MapBottomSheet from "@/components/map/MapBottomSheet";
import MapButtons from "@/components/map/MapButtons";
import MapNavigation from "@/components/map/MapNavigation";

Mapbox.setAccessToken(MAP_CONFIG.accessToken);

const Map = () => {
    const dispatch = useDispatch();
    const { sheetData, showSheet, openSheet, closeSheet } = useContext(BottomSheetContext);
    const { userLocation } = useContext(UserLocationContext);
    const location = useSelector(mapNavigationSelectors.location);
    const tracking = useSelector(mapNavigationSelectors.tracking);
    const recentSearches = useSelector(mapSearchSelectors.recentSearches);
    const navigationView = useSelector(mapNavigationSelectors.navigationView);
    const navigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
    const [currentStep, setCurrentStep] = useState(0);
    const { directions, setDirections, loadingDirections } = useNavigation({
        destinationLngLat: {
            lon: location?.lon,
            lat: location?.lat,
        },
        setCurrentStep,
    });
    const {
        mutate: refetchSpeedCamera,
        isSuccess: mutatedSpeedCameraSuccess,
        error: mutatedSpeedCameraError,
    } = useMutation({
        mutationFn: reportSpeedCamera,
        onSuccess: () => {
            setTimeout(() => closeSheet(), 3000);
        },
    });

    const defaultSettings = {
        centerCoordinate: [MAP_CONFIG.position.lon, MAP_CONFIG.position.lat] as Position,
        zoomLevel: MAP_CONFIG.noLocationZoom,
        pitch: MAP_CONFIG.pitch,
        heading: undefined,
    };

    useEffect(() => {
        if (tracking && navigationMode && !navigationView) {
            dispatch(mapNavigationActions.setNavigationView(true));
        }
    }, [tracking, navigationMode, navigationView]);

    const handleGasStationPress = () => {
        const street = sheetData?.markerProperties.street;
        const houseNumber = sheetData?.markerProperties.houseNumber || "";
        const postcode = sheetData?.markerProperties.postCode || "";
        const city = sheetData?.markerProperties.place || "";
        const country = "Deutschland";

        const newLocation = {
            country,
            city,
            lon: sheetData?.markerProperties.lng,
            lat: sheetData?.markerProperties.lat,
            formatted: `${street} ${houseNumber}, ${postcode} ${city}, ${country}`,
            address_line1: `${street} ${houseNumber}`,
            address_line2: `${postcode} ${city}, ${country}`,
            category: "commercial.gas",
            place_id: sheetData?.markerProperties.id,
        };

        dispatch(mapNavigationActions.setLocation(newLocation));
        closeSheet();
    };

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
                        animationDuration={250}
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

                <MapAlerts
                    directions={directions}
                    currentStep={currentStep}
                    speedCameraSuccess={mutatedSpeedCameraSuccess}
                    speedCameraError={mutatedSpeedCameraError}
                />

                {showSheet && (
                    <MapBottomSheet
                        onClose={closeSheet}
                        markerProps={{
                            title: sheetTitle(sheetData?.markerType, sheetData?.markerProperties),
                            data: openSheetData(sheetData?.markerType, sheetData?.markerProperties),
                            gasStation: {
                                show: sheetData?.markerType === MarkerSheet.GAS_STATION,
                                onPress: () => handleGasStationPress(),
                            },
                        }}
                        reportProps={{
                            refetchData: refetchSpeedCamera,
                        }}
                    />
                )}
            </View>

            {location && directions && (
                <MapNavigation
                    openSheet={openSheet}
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
