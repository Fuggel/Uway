import { useContext, useEffect } from "react";
import Mapbox, { Camera, Images, MapView } from "@rnmapbox/maps";
import { MAP_CONFIG, MAP_ICONS } from "../../constants/map-constants";
import { Dimensions, Image, Keyboard, StyleSheet, Text, View } from "react-native";
import {
    arrowDirection,
    determineIncidentIcon,
    determineMapStyle,
    determineSpeedLimitIcon,
} from "../../utils/map-utils";
import { useDispatch, useSelector } from "react-redux";
import { mapViewSelectors } from "../../store/mapView";
import useDirections from "../../hooks/useDirections";
import Loading from "../common/Loading";
import useSearchLocation from "../../hooks/useSearchLocation";
import useInstructions from "../../hooks/useInstructions";
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
import { Instruction } from "@/src/types/INavigation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapBottomSheet from "./MapBottomSheet";
import useIncidents from "@/src/hooks/useIncidents";
import { sheetData, sheetTitle } from "@/src/utils/sheet-utils";
import { UserLocationContext } from "@/src/contexts/UserLocationContext";
import { sessionToken } from "@/src/constants/auth-constants";
import Layers from "../layer/Layers";
import { MarkerBottomSheetContext } from "@/src/contexts/MarkerBottomSheetContext";
import { Position } from "@turf/helpers";

Mapbox.setAccessToken(MAP_CONFIG.accessToken);

const deviceHeight = Dimensions.get("window").height;

export default function Map() {
    const dispatch = useDispatch();
    const { showSheet, markerData, closeSheet } = useContext(MarkerBottomSheetContext);
    const { userLocation, userHeading } = useContext(UserLocationContext);
    const locationId = useSelector(mapNavigationSelectors.locationId);
    const tracking = useSelector(mapNavigationSelectors.tracking);
    const navigationView = useSelector(mapNavigationSelectors.navigationView);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
    const { locations, setLocations } = useSearchLocation({
        mapboxId: locationId,
        sessionToken,
    });
    const { directions, setDirections, loadingDirections } = useDirections({
        destinationLngLat: {
            lon: locations?.geometry?.coordinates[0] as number,
            lat: locations?.geometry?.coordinates[1] as number,
        },
    });
    const { speedCameras } = useSpeedCameras();
    const { speedLimits } = useSpeedLimits();
    const { incidents } = useIncidents();
    const { currentStep, setCurrentStep, remainingDistance, remainingTime } = useInstructions(directions, userLocation);

    const userSpeed = userLocation?.coords?.speed;
    const currentSpeed = userSpeed && userSpeed > 0 ? (userSpeed * 3.6).toFixed(1) : "0";

    const handleCancelNavigation = () => {
        setDirections(null);
        setCurrentStep(0);
        setLocations(null);
        dispatch(mapNavigationActions.setNavigationView(false));
        dispatch(mapNavigationActions.setIsNavigationMode(false));
        dispatch(mapNavigationActions.setSearchQuery(""));
        dispatch(mapNavigationActions.setLocationId(""));
    };

    useEffect(() => {
        if (directions && isNavigationMode && locations) {
            dispatch(mapNavigationActions.setNavigationView(true));
            dispatch(mapNavigationActions.setSearchQuery(""));
            setCurrentStep(0);
        }
    }, [isNavigationMode, directions]);

    useEffect(() => {
        if (directions?.legs[0].steps[currentStep]?.maneuver?.type === "arrive") {
            handleCancelNavigation();
        }
    }, [currentStep, directions]);

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

                {directions?.legs[0].steps
                    .slice(currentStep, currentStep + 1)
                    .map((step: Instruction, index: number) => {
                        const arrowDir = arrowDirection(step.maneuver.modifier);

                        return (
                            <View key={index} style={styles.instructionsContainer}>
                                <Text style={styles.stepInstruction}>{step.maneuver.instruction}</Text>

                                <View style={styles.directionRow}>
                                    {arrowDir !== undefined && (
                                        <MaterialCommunityIcons
                                            name={arrowDir}
                                            size={SIZES.iconSize.xl}
                                            color={COLORS.primary}
                                        />
                                    )}
                                    <Text style={styles.stepDistance}>{step.distance.toFixed(0)} m</Text>
                                </View>
                            </View>
                        );
                    })}

                <View style={styles.absoluteBottom}>
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
                <View style={styles.flexBottom}>
                    <MapNavigation
                        remainingDistance={remainingDistance}
                        remainingTime={remainingTime}
                        directions={directions}
                        locations={locations}
                        onCancelNavigation={handleCancelNavigation}
                    />
                </View>
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
    flexBottom: {
        flex: 1,
        maxHeight: deviceHeight > 1000 ? "12%" : "18%",
        justifyContent: "center",
        backgroundColor: COLORS.white_transparent,
    },
    instructionsContainer: {
        position: "absolute",
        top: deviceHeight > 1000 ? "4%" : "7%",
        left: SIZES.spacing.sm,
        maxWidth: "60%",
        backgroundColor: COLORS.white_transparent,
        borderRadius: SIZES.borderRadius.sm,
        padding: SIZES.spacing.sm,
    },
    stepInstruction: {
        fontSize: SIZES.fontSize.md,
        fontWeight: "bold",
    },
    stepDistance: {
        fontSize: SIZES.fontSize.sm,
        color: COLORS.gray,
    },
    directionRow: {
        flexDirection: "row",
        alignItems: "center",
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
