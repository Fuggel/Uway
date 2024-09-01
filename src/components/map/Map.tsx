import { useEffect, useState } from "react";
import Mapbox, { Camera, Images, LocationPuck, MapView, UserLocation } from "@rnmapbox/maps";
import { SHOW_SPEED_CAMERA_THRESHOLD_IN_METERS, MAP_CONFIG, SHOW_SPEED_LIMIT_THRESHOLD_IN_METERS, MAP_ICONS } from "../../constants/map-constants";
import { Image, StyleSheet, Text, View } from "react-native";
import { determineMapStyle, determineSpeedLimitIcon } from "../../utils/map-utils";
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
import { SpeedCameraFeature, SpeedLimitFeature } from "@/src/types/ISpeed";
import { SIZES } from "@/src/constants/size-constants";
import useParkAvailability from "@/src/hooks/useParkAvailability";
import useSpeedLimits from "@/src/hooks/useSpeedLimits";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

Mapbox.setAccessToken(MAP_CONFIG.accessToken);

const sessionToken = generateSessionToken();

export default function Map() {
    const dispatch = useDispatch();
    const [userLocation, setUserLocation] = useState<Mapbox.Location | null>(null);
    const searchQuery = useSelector(mapNavigationSelectors.searchQuery);
    const locationId = useSelector(mapNavigationSelectors.locationId);
    const tracking = useSelector(mapNavigationSelectors.tracking);
    const navigationView = useSelector(mapNavigationSelectors.navigationView);
    const navigationProfile = useSelector(mapNavigationSelectors.navigationProfile);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);

    const { suggestions } = useSearchSuggestion({ query: searchQuery, sessionToken });
    const { locations, setLocations } = useSearchLocation({ mapboxId: locationId, sessionToken });
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
                    animationDuration={2000}
                    animationMode="easeTo"
                    followUserLocation={tracking || navigationView}
                    pitch={navigationView ? MAP_CONFIG.followPitch : MAP_CONFIG.pitch}
                    followPitch={navigationView ? MAP_CONFIG.followPitch : MAP_CONFIG.pitch}
                    zoomLevel={MAP_CONFIG.zoom}
                    followZoomLevel={MAP_CONFIG.zoom}
                    defaultSettings={{
                        centerCoordinate: [MAP_CONFIG.position.lon, MAP_CONFIG.position.lat],
                    }}
                />

                <UserLocation onUpdate={(location) => setUserLocation(location)} />

                <LocationPuck
                    scale={["interpolate", ["linear"], ["zoom"], 10, 0.8, 20, 1.2]}
                    puckBearingEnabled
                    pulsing={{
                        isEnabled: true,
                        color: COLORS.primary,
                        radius: 45,
                    }}
                />
                {directions?.geometry?.coordinates && (
                    <LineLayer
                        sourceId="route-source"
                        layerId="route-layer"
                        coordinates={directions.geometry.coordinates}
                    />
                )}
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
            </MapView>

            <MapButtons />

            {!directions && (
                <MapSearchbar suggestions={suggestions} />
            )}

            <View style={styles.absoluteBottom}>
                {speedLimits?.alert && (
                    <View>
                        <Image
                            source={determineSpeedLimitIcon((speedLimits.alert.feature.properties as SpeedLimitFeature).maxspeed)}
                            style={styles.speedLimitImage}
                        />
                        {userLocation?.coords && (
                            <Toast show={!!speedLimits.alert} type="info">
                                <Text style={styles.speedAlert}>{currentSpeed} km/h</Text>
                            </Toast>
                        )}
                    </View>
                )}

                {speedCameras?.alert && (
                    <Toast
                        show={!!speedCameras.alert}
                        type="error"
                        title={`Speed camera in ${speedCameras.alert.distance.toFixed(0)} m`}
                    >
                        <Text style={styles.speedAlert}>
                            Max speed: {(speedCameras.alert.feature.properties as SpeedCameraFeature).maxspeed} km/h
                        </Text>
                    </Toast>
                )}

                <MapNavigation
                    directions={directions}
                    locations={locations}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    onCancelNavigation={handleCancelNavigation}
                />
            </View>
        </View>
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
        width: 0,
    },
    speedAlert: {
        color: COLORS.dark,
        fontSize: SIZES.fontSize.md,
        fontWeight: "bold",
    },
    speedLimitImage: {
        width: wp("15%"),
        height: wp("15%"),
        marginBottom: SIZES.spacing.md,
        marginLeft: SIZES.spacing.sm,
    },
});