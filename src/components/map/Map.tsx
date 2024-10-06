import { useEffect } from "react";
import Mapbox, { Camera, Images, MapView } from "@rnmapbox/maps";
import {
    SHOW_SPEED_CAMERA_THRESHOLD_IN_METERS,
    MAP_CONFIG,
    SHOW_SPEED_LIMIT_THRESHOLD_IN_METERS,
    MAP_ICONS,
    SHOW_GAS_STATIONS_THRESHOLD_IN_KILOMETERS,
    SHOW_INCIDENTS_THRESHOLD_IN_METERS,
} from "../../constants/map-constants";
import { Dimensions, Image, Keyboard, StyleSheet, Text, View } from "react-native";
import {
    arrowDirection,
    determineIncidentIcon,
    determineMapStyle,
    determineSpeedLimitIcon,
    getStationIcon,
} from "../../utils/map-utils";
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
import { SpeedCameraProperties, SpeedLimitFeature } from "@/src/types/ISpeed";
import { SIZES } from "@/src/constants/size-constants";
import useParkAvailability from "@/src/hooks/useParkAvailability";
import useSpeedLimits from "@/src/hooks/useSpeedLimits";
import { Instruction } from "@/src/types/INavigation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useUserLocation from "@/src/hooks/useUserLocation";
import { determineTheme } from "@/src/utils/theme-utils";
import useGasStations from "@/src/hooks/useGasStations";
import { GasStation } from "@/src/types/IGasStation";
import MapBottomSheet from "./MapBottomSheet";
import useIncidents from "@/src/hooks/useIncidents";
import { IncidentProperties, IncidentType } from "@/src/types/ITraffic";
import useMarkerBottomSheet from "@/src/hooks/useMarkerBottomSheet";
import { MarkerSheet } from "@/src/types/ISheet";
import { sheetData, sheetTitle } from "@/src/utils/sheet-utils";
import { ParkAvailabilityProperties } from "@/src/types/IParking";

Mapbox.setAccessToken(MAP_CONFIG.accessToken);

const sessionToken = generateSessionToken();

const deviceHeight = Dimensions.get("window").height;

export default function Map() {
    const dispatch = useDispatch();
    const { showSheet, markerData, openSheet, closeSheet } = useMarkerBottomSheet();
    const { userLocation, userHeading } = useUserLocation();
    const searchQuery = useSelector(mapNavigationSelectors.searchQuery);
    const locationId = useSelector(mapNavigationSelectors.locationId);
    const tracking = useSelector(mapNavigationSelectors.tracking);
    const navigationView = useSelector(mapNavigationSelectors.navigationView);
    const navigationProfile = useSelector(mapNavigationSelectors.navigationProfile);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);

    const { locations, setLocations } = useSearchLocation({
        mapboxId: locationId,
        sessionToken,
    });
    const { suggestions } = useSearchSuggestion({
        query: searchQuery,
        sessionToken,
        lngLat: {
            lon: userLocation?.coords?.longitude as number,
            lat: userLocation?.coords?.latitude as number,
        },
    });
    const { directions, setDirections, loadingDirections } = useDirections({
        profile: navigationProfile,
        startLngLat: {
            lon: userLocation?.coords?.longitude as number,
            lat: userLocation?.coords?.latitude as number,
        },
        destinationLngLat: {
            lon: locations?.geometry?.coordinates[0] as number,
            lat: locations?.geometry?.coordinates[1] as number,
        },
        isNavigationMode,
        userLocation: {
            lon: userLocation?.coords?.longitude as number,
            lat: userLocation?.coords?.latitude as number,
        },
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
    const { gasStations } = useGasStations({
        userLon: userLocation?.coords?.longitude as number,
        userLat: userLocation?.coords?.latitude as number,
        radius: SHOW_GAS_STATIONS_THRESHOLD_IN_KILOMETERS,
    });
    const { incidents } = useIncidents({
        userLon: userLocation?.coords?.longitude as number,
        userLat: userLocation?.coords?.latitude as number,
        distance: SHOW_INCIDENTS_THRESHOLD_IN_METERS,
    });
    const { parkAvailability } = useParkAvailability();
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
                                ? [userLocation.coords.longitude, userLocation.coords.latitude]
                                : tracking && !userLocation
                                ? [MAP_CONFIG.position.lon, MAP_CONFIG.position.lat]
                                : undefined
                        }
                        defaultSettings={{
                            centerCoordinate: [MAP_CONFIG.position.lon, MAP_CONFIG.position.lat],
                            zoomLevel: !userLocation ? MAP_CONFIG.noLocationZoom : MAP_CONFIG.zoom,
                            pitch: MAP_CONFIG.pitch,
                        }}
                    />

                    {directions?.geometry?.coordinates && (
                        <LineLayer
                            sourceId="route-source"
                            layerId="route-layer"
                            coordinates={directions.geometry.coordinates}
                            style={{
                                lineWidth: ["interpolate", ["exponential", 1.5], ["zoom"], 10, 5, 15, 8, 20, 20],
                            }}
                        />
                    )}
                    {parkAvailability?.features?.map((feature, i) => (
                        <View key={i}>
                            <SymbolLayer
                                sourceId={`parking-availability-source-${i}`}
                                layerId={`parking-availability-layer-${i}`}
                                coordinates={(feature.geometry as Point).coordinates}
                                onPress={() =>
                                    openSheet<ParkAvailabilityProperties>(
                                        MarkerSheet.PARKING,
                                        feature.properties as ParkAvailabilityProperties
                                    )
                                }
                                properties={feature.properties}
                                style={{
                                    iconImage: "parking-availability",
                                    textField: `
                                    ${feature.properties?.name}
                                    ${feature.properties?.free} / ${feature.properties?.total}
                                `,
                                    textSize: SIZES.fontSize.sm,
                                    textColor: determineTheme(mapStyle) === "dark" ? COLORS.white : COLORS.gray,
                                    textOffset: [0, 2.5],
                                    iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0.4, 20, 0.6],
                                }}
                                belowLayerId="user-location-layer"
                            />
                        </View>
                    ))}
                    {gasStations?.features?.map((feature, i) => (
                        <SymbolLayer
                            key={i}
                            sourceId={`gas-station-source-${i}`}
                            layerId={`gas-station-layer-${i}`}
                            coordinates={(feature.geometry as Point).coordinates}
                            onPress={() =>
                                openSheet<GasStation>(MarkerSheet.GAS_STATION, feature.properties as GasStation)
                            }
                            properties={feature.properties}
                            style={{
                                iconImage: getStationIcon(
                                    gasStations.features.map((f) => f.properties as GasStation),
                                    feature.properties?.diesel
                                ),
                                iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0.5, 20, 0.7],
                            }}
                            belowLayerId="user-location-layer"
                        />
                    ))}
                    {speedCameras?.data?.features?.map((feature, i) => (
                        <SymbolLayer
                            key={i}
                            sourceId={`speed-camera-source-${i}`}
                            layerId={`speed-camera-layer-${i}`}
                            coordinates={(feature.geometry as Point).coordinates}
                            onPress={() =>
                                openSheet<SpeedCameraProperties>(
                                    MarkerSheet.SPEED_CAMERA,
                                    feature.properties as SpeedCameraProperties
                                )
                            }
                            style={{
                                iconImage: "speed-camera",
                                iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0.4, 20, 0.6],
                            }}
                            belowLayerId="user-location-layer"
                        />
                    ))}
                    {incidents?.data?.incidents?.map((incident, i) => (
                        <View key={i}>
                            <LineLayer
                                sourceId={`incident-line-source-${i}`}
                                layerId={`incident-line-layer-${i}`}
                                coordinates={incident.geometry.coordinates}
                                properties={incident.properties}
                                style={{
                                    lineWidth: ["interpolate", ["exponential", 1.5], ["zoom"], 10, 5, 15, 8, 20, 20],
                                    lineColor: "#FF0000",
                                }}
                                belowLayerId="user-location-layer"
                            />
                            <SymbolLayer
                                key={i}
                                sourceId={`incident-symbol-source-${i}`}
                                layerId={`incident-symbol-layer-${i}`}
                                coordinates={incident.geometry.coordinates[incident.geometry.coordinates.length - 1]}
                                onPress={() =>
                                    openSheet<IncidentProperties>(
                                        MarkerSheet.INCIDENT,
                                        incident.properties as IncidentProperties
                                    )
                                }
                                properties={incident.properties}
                                style={{
                                    iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0.5, 20, 0.7],
                                    iconImage: [
                                        "match",
                                        ["get", "iconCategory"],
                                        IncidentType.Accident,
                                        "incident-accident",
                                        IncidentType.Rain,
                                        "incident-rain",
                                        IncidentType.Ice,
                                        "incident-ice",
                                        IncidentType.Jam,
                                        "incident-jam",
                                        IncidentType.LaneClosed,
                                        "incident-road-closure",
                                        IncidentType.RoadClosed,
                                        "incident-road-closure",
                                        IncidentType.RoadWorks,
                                        "incident-road-works",
                                        IncidentType.Wind,
                                        "incident-wind",
                                        IncidentType.BrokenDownVehicle,
                                        "incident-broken-down-vehicle",
                                        "incident-caution",
                                    ],
                                }}
                                belowLayerId="user-location-layer"
                            />
                        </View>
                    ))}
                    {userLocation && (
                        <SymbolLayer
                            sourceId="user-location"
                            layerId="user-location-layer"
                            coordinates={[userLocation.coords?.longitude, userLocation.coords?.latitude]}
                            properties={{
                                heading: userHeading,
                                ...userLocation,
                            }}
                            style={{
                                iconImage: "user-location",
                                iconRotationAlignment: "map",
                                iconPitchAlignment: "map",
                                iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0.4, 20, 0.6],
                                iconRotate: ["get", "heading"],
                            }}
                        />
                    )}
                </MapView>

                <MapButtons />

                {!directions && userLocation && <MapSearchbar suggestions={suggestions} />}

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
