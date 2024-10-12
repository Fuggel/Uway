import React, { useContext } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Mapbox, { Camera, Images, MapView, UserLocation } from "@rnmapbox/maps";
import { Position } from "@turf/helpers";

import { sessionToken } from "@/constants/auth-constants";
import { MAP_CONFIG, MAP_ICONS } from "@/constants/map-constants";
import { MarkerBottomSheetContext } from "@/contexts/MarkerBottomSheetContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useDirections from "@/hooks/useDirections";
import useLocationPermission from "@/hooks/useLocationPermissions";
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
import MapSearchbar from "./MapSearchbar";

Mapbox.setAccessToken(MAP_CONFIG.accessToken);

const Map = () => {
    const dispatch = useDispatch();
    const { hasLocationPermissions } = useLocationPermission();
    const { showSheet, markerData, closeSheet } = useContext(MarkerBottomSheetContext);
    const { userLocation, setUserLocation } = useContext(UserLocationContext);
    const locationId = useSelector(mapNavigationSelectors.locationId);
    const tracking = useSelector(mapNavigationSelectors.tracking);
    const navigationView = useSelector(mapNavigationSelectors.navigationView);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
    const { locations, setLocations } = useSearchLocation({ mapboxId: locationId, sessionToken });
    const { directions, setDirections, loadingDirections } = useDirections({
        destinationLngLat: {
            lon: locations?.geometry?.coordinates[0] as number,
            lat: locations?.geometry?.coordinates[1] as number,
        },
    });

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
                    }}
                >
                    <Images images={MAP_ICONS} />

                    <Camera
                        followUserLocation={(hasLocationPermissions && tracking) || navigationView}
                        followPitch={navigationView ? MAP_CONFIG.followPitch : MAP_CONFIG.pitch}
                        followZoomLevel={navigationView ? MAP_CONFIG.followZoom : MAP_CONFIG.zoom}
                        followHeading={tracking || navigationView ? userLocation?.coords.heading : undefined}
                        defaultSettings={{
                            centerCoordinate: [MAP_CONFIG.position.lon, MAP_CONFIG.position.lat] as Position,
                            zoomLevel: !userLocation ? MAP_CONFIG.noLocationZoom : MAP_CONFIG.zoom,
                            pitch: MAP_CONFIG.pitch,
                        }}
                    />

                    <Layers directions={directions} />

                    {hasLocationPermissions && (
                        <UserLocation
                            animated
                            showsUserHeadingIndicator
                            onUpdate={(location) => setUserLocation(location)}
                        />
                    )}
                </MapView>

                <MapButtons />

                {!directions && userLocation && <MapSearchbar />}

                <MapAlerts directions={directions} />

                {showSheet && (
                    <MapBottomSheet
                        title={sheetTitle(markerData?.type, markerData?.properties)}
                        data={sheetData(markerData?.type, markerData?.properties)}
                        onClose={closeSheet}
                    />
                )}
            </View>

            {(locations || directions) && (
                <MapNavigation
                    directions={directions}
                    locations={locations}
                    setDirections={setDirections}
                    setLocations={setLocations}
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
