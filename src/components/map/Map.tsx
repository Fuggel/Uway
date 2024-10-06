import { useContext } from "react";
import Mapbox, { Camera, Images, MapView } from "@rnmapbox/maps";
import { MAP_CONFIG, MAP_ICONS } from "../../constants/map-constants";
import { Image, Keyboard, StyleSheet, Text, View } from "react-native";
import { determineIncidentIcon, determineMapStyle, determineSpeedLimitIcon } from "../../utils/map-utils";
import { useDispatch, useSelector } from "react-redux";
import { mapViewSelectors } from "../../store/mapView";
import useDirections from "../../hooks/useDirections";
import Loading from "../common/Loading";
import useSearchLocation from "../../hooks/useSearchLocation";
import MapButtons from "./MapButtons";
import MapNavigation from "./MapNavigation";
import MapSearchbar from "./MapSearchbar";
import { COLORS } from "../../constants/colors-constants";
import { mapNavigationActions, mapNavigationSelectors } from "../../store/mapNavigation";
import useSpeedCameras from "@/src/hooks/useSpeedCameras";
import Toast from "../common/Toast";
import { SpeedLimitFeature } from "@/src/types/ISpeed";
import { SIZES } from "@/src/constants/size-constants";
import useSpeedLimits from "@/src/hooks/useSpeedLimits";
import MapBottomSheet from "./MapBottomSheet";
import useIncidents from "@/src/hooks/useIncidents";
import { sheetData, sheetTitle } from "@/src/utils/sheet-utils";
import { UserLocationContext } from "@/src/contexts/UserLocationContext";
import { sessionToken } from "@/src/constants/auth-constants";
import Layers from "../layer/Layers";
import { MarkerBottomSheetContext } from "@/src/contexts/MarkerBottomSheetContext";
import { Position } from "@turf/helpers";

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
    const { speedCameras } = useSpeedCameras();
    const { speedLimits } = useSpeedLimits();
    const { incidents } = useIncidents();
    const { directions, setDirections, loadingDirections } = useDirections({
        destinationLngLat: {
            lon: locations?.geometry?.coordinates[0] as number,
            lat: locations?.geometry?.coordinates[1] as number,
        },
    });

    const userSpeed = userLocation?.coords?.speed;
    const currentSpeed = userSpeed && userSpeed > 0 ? (userSpeed * 3.6).toFixed(1) : "0";

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

                <View style={styles.absoluteBottom}>
                    {/* TODO: Refactor this and extract into a separate component named MapAlerts */}
                    {speedLimits?.alert && (
                        <Image
                            source={determineSpeedLimitIcon(
                                (speedLimits.alert.feature.properties as SpeedLimitFeature).maxspeed
                            )}
                            style={styles.speedLimitImage}
                        />
                    )}

                    {userLocation?.coords && (
                        <Toast show type="info">
                            <Text style={styles.alertMsg}>{currentSpeed} km/h</Text>
                        </Toast>
                    )}

                    {speedCameras?.alert && (
                        <Toast
                            show={!!speedCameras.alert}
                            type="error"
                            title={`Blitzer in ${speedCameras.alert.distance.toFixed(0)} m`}
                        />
                    )}

                    {incidents?.alert && (
                        <Toast
                            show={!!incidents.alert}
                            type="error"
                            image={determineIncidentIcon(incidents.alert.events[0]?.iconCategory)}
                            title={`Achtung! Gefahr in ${incidents.alert.distance.toFixed(0)} m`}
                        >
                            <Text style={styles.alertMsg}>{incidents.alert.events[0]?.description}</Text>
                        </Toast>
                    )}
                </View>

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
    absoluteBottom: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        pointerEvents: "none",
    },
    alertMsg: {
        color: COLORS.dark,
        fontSize: SIZES.fontSize.md,
        fontWeight: "bold",
    },
    speedLimitImage: {
        width: 75,
        height: 75,
        marginBottom: SIZES.spacing.md,
        marginLeft: SIZES.spacing.sm,
    },
});
