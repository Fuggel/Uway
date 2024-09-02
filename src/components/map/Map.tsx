import { useEffect } from "react";
import Mapbox, { Camera, Images, MapView } from "@rnmapbox/maps";
import { SHOW_SPEED_CAMERA_THRESHOLD_IN_METERS, MAP_CONFIG, SHOW_SPEED_LIMIT_THRESHOLD_IN_METERS, MAP_ICONS } from "../../constants/map-constants";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { arrowDirection, determineMapStyle, determineSpeedLimitIcon } from "../../utils/map-utils";
import { useDispatch, useSelector } from "react-redux";
import { mapViewSelectors } from "../../store/mapView";
import useDirections from "../../hooks/useDirections";
import LineLayer from "../layer/LineLayer";
import Loading from "../common/Loading";
import useSearchSuggestion from "../../hooks/useSearchSuggestion";
import { generateSessionToken } from "../../utils/auth-utils";
import useSearchLocation from "../../hooks/useSearchLocation";
import useInstructions from "../../hooks/useInstructions";
import MapButtons from "./MapButtons";
import MapNavigation from "./MapNavigation";
import MapSearchbar from "./MapSearchbar";
import { COLORS } from "../../constants/colors-constants";
import { mapNavigationActions, mapNavigationSelectors } from "../../store/mapNavigation";
import useSpeedCameras from "@/src/hooks/useSpeedCameras";
import SymbolLayer from "../layer/SymbolLayer";
import { Point } from "@turf/helpers";
import Toast from "../common/Toast";
import { SpeedLimitFeature } from "@/src/types/ISpeed";
import { SIZES } from "@/src/constants/size-constants";
import useParkAvailability from "@/src/hooks/useParkAvailability";
import useSpeedLimits from "@/src/hooks/useSpeedLimits";
import { Instruction } from "@/src/types/INavigation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useUserLocation from "@/src/hooks/useUserLocation";

Mapbox.setAccessToken(MAP_CONFIG.accessToken);

const sessionToken = generateSessionToken();

const deviceHeight = Dimensions.get("window").height;

export default function Map() {
    const dispatch = useDispatch();
    const { userLocation } = useUserLocation({ mockMode: true });
    const searchQuery = useSelector(mapNavigationSelectors.searchQuery);
    const locationId = useSelector(mapNavigationSelectors.locationId);
    const tracking = useSelector(mapNavigationSelectors.tracking);
    const navigationView = useSelector(mapNavigationSelectors.navigationView);
    const navigationProfile = useSelector(mapNavigationSelectors.navigationProfile);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);

    const { locations, setLocations } = useSearchLocation({ mapboxId: locationId, sessionToken });
    const { suggestions } = useSearchSuggestion({
        query: searchQuery,
        sessionToken,
        lngLat: {
            lon: userLocation?.coords?.longitude as number,
            lat: userLocation?.coords?.latitude as number,
        }
    });
    const { directions, setDirections, loadingDirections } = useDirections({
        profile: navigationProfile,
        startLngLat: {
            lon: userLocation?.coords?.longitude as number,
            lat: userLocation?.coords?.latitude as number
        },
        destinationLngLat: {
            lon: locations?.geometry.coordinates[0] as number,
            lat: locations?.geometry.coordinates[1] as number
        },
        isNavigationMode
    });
    const { speedCameras } = useSpeedCameras({
        userLon: userLocation?.coords?.longitude as number,
        userLat: userLocation?.coords?.latitude as number,
        distance: SHOW_SPEED_CAMERA_THRESHOLD_IN_METERS,
    });
    const { speedLimits } = useSpeedLimits({
        userLon: userLocation?.coords?.longitude as number,
        userLat: userLocation?.coords?.latitude as number,
        distance: SHOW_SPEED_LIMIT_THRESHOLD_IN_METERS,
    });
    const { parkAvailability } = useParkAvailability();
    const { currentStep, setCurrentStep } = useInstructions(directions, userLocation);

    const userSpeed = userLocation?.coords?.speed;
    const currentSpeed = userSpeed && userSpeed > 0 ? (userSpeed * 3.6).toFixed(1) : "0";
    const speedCameraDistance = speedCameras?.alert?.distance.toFixed(0);

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
    }, [isNavigationMode]);

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
                        dispatch(mapNavigationActions.setTracking(false));
                        dispatch(mapNavigationActions.setNavigationView(false));
                    }}
                >
                    <Images images={MAP_ICONS} />

                    <Camera
                        animationDuration={1500}
                        animationMode="easeTo"
                        pitch={navigationView ? MAP_CONFIG.followPitch : MAP_CONFIG.pitch}
                        zoomLevel={navigationView ? MAP_CONFIG.followZoom : MAP_CONFIG.zoom}
                        heading={userLocation && (tracking || navigationView) ? userLocation.coords?.heading as number : undefined}
                        centerCoordinate={userLocation && (tracking || navigationView) ?
                            [userLocation.coords.longitude, userLocation.coords.latitude] :
                            [MAP_CONFIG.position.lon, MAP_CONFIG.position.lat]
                        }
                    />

                    {directions?.geometry?.coordinates && (
                        <LineLayer
                            sourceId="route-source"
                            layerId="route-layer"
                            coordinates={directions.geometry.coordinates}
                        />
                    )}
                    {parkAvailability?.features?.map((feature, i) => (
                        <View key={i}>
                            <SymbolLayer
                                sourceId={`parking-availability-source-${i}`}
                                layerId={`parking-availability-layer-${i}`}
                                coordinates={(feature.geometry as Point).coordinates}
                                iconImage="parking-availability"
                                properties={feature.properties}
                                style={{
                                    textField: `
                                    ${feature.properties?.name}
                                    ${feature.properties?.free} / ${feature.properties?.total}
                                `,
                                    textSize: SIZES.fontSize.sm,
                                    textColor: COLORS.white,
                                    textOffset: [0, 2.5],
                                }}
                                iconSize={[
                                    "interpolate",
                                    ["linear"],
                                    ["zoom"],
                                    10,
                                    0.4,
                                    20,
                                    0.6,
                                ]}
                            />
                        </View>
                    ))}
                    {speedCameras?.data?.features?.map((feature, i) => (
                        <SymbolLayer
                            key={i}
                            sourceId={`speed-camera-source-${i}`}
                            layerId={`speed-camera-layer-${i}`}
                            coordinates={(feature.geometry as Point).coordinates}
                            iconImage="speed-camera"
                            iconSize={[
                                "interpolate",
                                ["linear"],
                                ["zoom"],
                                10,
                                0.4,
                                20,
                                0.6,
                            ]}
                        />
                    ))}
                    {userLocation && (
                        <SymbolLayer
                            sourceId="user-location"
                            layerId="user-location-layer"
                            coordinates={[userLocation.coords.longitude, userLocation.coords.latitude]}
                            iconImage="user-location"
                            iconSize={[
                                "interpolate",
                                ["linear"],
                                ["zoom"],
                                10,
                                0.4,
                                20,
                                0.6,
                            ]}
                        />
                    )}
                </MapView>

                <MapButtons />

                {!directions && (
                    <MapSearchbar suggestions={suggestions} />
                )}

                {directions?.legs[0].steps
                    .slice(currentStep, currentStep + 1)
                    .map((step: Instruction, index: number) => {
                        const arrowDir = arrowDirection(step);

                        return (
                            <View key={index} style={styles.instructionsContainer}>
                                <Text style={styles.stepInstruction}>
                                    {step.maneuver.instruction}
                                </Text>

                                <View style={styles.directionRow}>
                                    {arrowDir !== undefined &&
                                        <MaterialCommunityIcons
                                            name={`arrow-${arrowDir}-bold`}
                                            size={SIZES.iconSize.xl}
                                            color={COLORS.primary}
                                        />
                                    }
                                    <TouchableOpacity onPress={() => setCurrentStep(index)}>
                                        <Text style={styles.stepDistance}>
                                            {step.distance.toFixed(0)} m
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}

                <View style={styles.absoluteBottom}>
                    {speedLimits?.alert && (
                        <Image
                            source={determineSpeedLimitIcon((speedLimits.alert.feature.properties as SpeedLimitFeature).maxspeed)}
                            style={styles.speedLimitImage}
                        />
                    )}

                    {userLocation?.coords && (
                        <Toast show type="info">
                            <Text style={styles.speedAlert}>{currentSpeed} km/h</Text>
                        </Toast>
                    )}

                    {speedCameras?.alert && (
                        <Toast
                            show={!!speedCameras.alert}
                            type="error"
                            title={`Blitzer in ${speedCameraDistance} m`}
                        />
                    )}
                </View>
            </View>

            {(locations || directions) && (
                <View style={styles.flexBottom}>
                    <MapNavigation
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
        maxHeight: deviceHeight > 1000 ? "10%" : "14%",
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
    speedAlert: {
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