import { useContext } from "react";
import Mapbox, { Camera, Images, MapView } from "@rnmapbox/maps";
import { MAP_CONFIG, MAP_ICONS } from "../../constants/map-constants";
import { Keyboard, StyleSheet, View } from "react-native";
import { determineMapStyle } from "../../utils/map-utils";
import { useDispatch, useSelector } from "react-redux";
import { mapViewSelectors } from "../../store/mapView";
import useDirections from "../../hooks/useDirections";
import Loading from "../common/Loading";
import useSearchLocation from "../../hooks/useSearchLocation";
import MapButtons from "./MapButtons";
import MapNavigation from "./MapNavigation";
import MapSearchbar from "./MapSearchbar";
import { mapNavigationActions, mapNavigationSelectors } from "../../store/mapNavigation";
import MapBottomSheet from "./MapBottomSheet";
import { sheetData, sheetTitle } from "@/src/utils/sheet-utils";
import { UserLocationContext } from "@/src/contexts/UserLocationContext";
import { sessionToken } from "@/src/constants/auth-constants";
import Layers from "../layer/Layers";
import { MarkerBottomSheetContext } from "@/src/contexts/MarkerBottomSheetContext";
import { Position } from "@turf/helpers";
import MapAlerts from "./MapAlerts";

Mapbox.setAccessToken(MAP_CONFIG.accessToken);

export default function Map() {
    const dispatch = useDispatch();
    const { showSheet, markerData, closeSheet } = useContext(MarkerBottomSheetContext);
    const { userLocation, userHeading } = useContext(UserLocationContext);
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
                        animationDuration={500}
                        animationMode="linearTo"
                        pitch={navigationView ? MAP_CONFIG.followPitch : MAP_CONFIG.pitch}
                        zoomLevel={
                            !userLocation
                                ? MAP_CONFIG.noLocationZoom
                                : navigationView
                                ? MAP_CONFIG.followZoom
                                : MAP_CONFIG.zoom
                        }
                        heading={userLocation && userHeading && (tracking || navigationView) ? userHeading : undefined}
                        centerCoordinate={
                            userLocation && (tracking || navigationView)
                                ? ([userLocation.coords.longitude, userLocation.coords.latitude] as Position)
                                : tracking && !userLocation
                                ? ([MAP_CONFIG.position.lon, MAP_CONFIG.position.lat] as Position)
                                : undefined
                        }
                        defaultSettings={{
                            centerCoordinate: [MAP_CONFIG.position.lon, MAP_CONFIG.position.lat] as Position,
                            zoomLevel: !userLocation ? MAP_CONFIG.noLocationZoom : MAP_CONFIG.zoom,
                            pitch: MAP_CONFIG.pitch,
                        }}
                    />

                    <Layers directions={directions} />
                </MapView>

                <MapButtons />

                {!directions && userLocation && <MapSearchbar />}

                <MapAlerts />

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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    map: {
        flex: 1,
    },
});
