import { useEffect, useRef } from "react";
import Mapbox, { Camera, Images, LocationPuck, MapView } from "@rnmapbox/maps";
import { MAP_CONFIG } from "../constants/map-constants";
import { StyleSheet, View } from "react-native";
import { CameraRef } from "@rnmapbox/maps/lib/typescript/src/components/Camera";
import useUserLocation from "../hooks/useUserLocation";
import { determineMapStyle } from "../utils/map-utils";
import { useDispatch, useSelector } from "react-redux";
import { mapViewSelectors } from "../store/mapView";
import useDirections from "../hooks/useDirections";
import LineLayer from "./Layers/LineLayer";
import Loading from "./Loading";
import useSearchSuggestion from "../hooks/useSearchSuggestion";
import { generateSessionToken } from "../utils/auth-utils";
import useSearchLocation from "../hooks/useSeachLocation";
import useInstructions from "../hooks/useInstructions";
import MapButtons from "./MapButtons";
import MapNavigation from "./MapNavigation";
import MapSearchbar from "./MapSearchbar";
import { COLORS } from "../constants/colors-constants";
import { mapNavigationActions, mapNavigationSelectors } from "../store/mapNavigation";

Mapbox.setAccessToken(MAP_CONFIG.accessToken);

const sessionToken = generateSessionToken();

export default function Map() {
    const cameraRef = useRef<CameraRef | null>(null);
    const dispatch = useDispatch();
    const searchQuery = useSelector(mapNavigationSelectors.searchQuery);
    const locationId = useSelector(mapNavigationSelectors.locationId);
    const navigationView = useSelector(mapNavigationSelectors.navigationView);
    const navigationProfile = useSelector(mapNavigationSelectors.navigationProfile);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);

    const { userLocation } = useUserLocation();
    const { suggestions } = useSearchSuggestion({ query: searchQuery, sessionToken });
    const { locations, setLocations } = useSearchLocation({ mapboxId: locationId, sessionToken });
    const { directions, setDirections, loadingDirections } = useDirections({
        profile: navigationProfile,
        startLngLat: {
            lon: userLocation?.coords.longitude as number,
            lat: userLocation?.coords.latitude as number
        },
        destinationLngLat: {
            lon: locations?.geometry.coordinates[0] as number,
            lat: locations?.geometry.coordinates[1] as number
        },
        isNavigationMode
    });
    const { currentStep, setCurrentStep } = useInstructions(directions, userLocation);

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
    }, [directions, isNavigationMode]);

    return (
        <View style={styles.container}>
            {loadingDirections && <Loading />}

            <MapView
                style={styles.map}
                styleURL={determineMapStyle(mapStyle)}
                scaleBarEnabled={false}
                onTouchStart={() => dispatch(mapNavigationActions.setNavigationView(false))}
            >
                <Images
                    images={{
                        "user-location-icon": require("../assets/images/map-icons/user-location.png"),
                    }}
                />

                <Camera
                    ref={cameraRef}
                    zoomLevel={MAP_CONFIG.zoom}
                    pitch={MAP_CONFIG.pitch}
                    followUserLocation={!!userLocation}
                    followZoomLevel={MAP_CONFIG.followZoom}
                    followPitch={navigationView ? MAP_CONFIG.followPitch : MAP_CONFIG.pitch}
                    followHeading={userLocation?.coords.heading || 0}
                    defaultSettings={{
                        centerCoordinate: [
                            MAP_CONFIG.position.lon,
                            MAP_CONFIG.position.lat,
                        ],
                    }}
                />
                <LocationPuck
                    topImage="user-location-icon"
                    scale={1.5}
                    puckBearing="heading"
                    puckBearingEnabled
                    pulsing={{
                        isEnabled: true,
                        color: COLORS.primary,
                        radius: 50,
                    }}
                />
                {directions?.geometry?.coordinates && (
                    <LineLayer
                        sourceId="route-source"
                        layerId="route-layer"
                        coordinates={directions.geometry.coordinates}
                    />
                )}
            </MapView>

            <MapButtons />
            {!directions && <MapSearchbar suggestions={suggestions} />}

            <MapNavigation
                directions={directions}
                locations={locations}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                onCancelNavigation={handleCancelNavigation}
            />
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
});