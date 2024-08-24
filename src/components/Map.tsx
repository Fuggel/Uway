import { useEffect, useRef, useState } from "react";
import Mapbox, { Camera, Images, LocationPuck, MapView } from "@rnmapbox/maps";
import { MAP_CONFIG } from "../constants/map-constants";
import { StyleSheet, View } from "react-native";
import { CameraRef } from "@rnmapbox/maps/lib/typescript/src/components/Camera";
import useUserLocation from "../hooks/useUserLocation";
import { determineMapStyle } from "../utils/map-utils";
import { useSelector } from "react-redux";
import { selectMapboxTheme } from "../store/mapView";
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
import { RouteProfileType } from "../types/IMap";
import { COLORS } from "../constants/colors-constants";

Mapbox.setAccessToken(MAP_CONFIG.accessToken);

const sessionToken = generateSessionToken();

export default function Map() {
    const cameraRef = useRef<CameraRef | null>(null);
    const mapStyle = useSelector(selectMapboxTheme);
    const [searchQuery, setSearchQuery] = useState("");
    const [locationId, setLocationId] = useState("");
    const [navigationView, setNavigationView] = useState(false);
    const [isNavigationMode, setIsNavigationMode] = useState(false);
    const [navigationProfile, setNavigationProfile] = useState<RouteProfileType>(RouteProfileType.DRIVING);
    const { userLocation } = useUserLocation();
    const { suggestions } = useSearchSuggestion({ query: searchQuery, sessionToken });
    const { locations, setLocations } = useSearchLocation({ mapboxId: locationId, sessionToken });
    const { directions, setDirections, loadingDirections } = useDirections({
        profile: navigationProfile,
        startLngLat: { lon: userLocation?.coords.longitude as number, lat: userLocation?.coords.latitude as number },
        destinationLngLat: { lon: locations?.geometry.coordinates[0] as number, lat: locations?.geometry.coordinates[1] as number },
        isNavigationMode
    });
    const { currentStep, setCurrentStep } = useInstructions(directions, userLocation);

    const handleCancelNavigation = () => {
        setNavigationView(false);
        setDirections(null);
        setIsNavigationMode(false);
        setCurrentStep(0);
        setSearchQuery("");
        setLocations(null);
    };

    useEffect(() => {
        if (directions && isNavigationMode && locations) {
            setNavigationView(true);
            setSearchQuery("");
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
                onTouchStart={() => setNavigationView(false)}
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

            {!directions &&
                <MapSearchbar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    suggestions={suggestions}
                    setLocationId={setLocationId}
                />
            }
            <MapButtons
                navigationView={navigationView}
                setNavigationView={setNavigationView}
                directions={directions}
                locations={locations}
                isNavigationMode={isNavigationMode}
                setIsNavigationMode={setIsNavigationMode}
                profileType={navigationProfile}
                setProfileType={setNavigationProfile}
                onCancelNavigation={handleCancelNavigation}
            />
            {directions?.legs?.[0]?.steps && (
                <MapNavigation
                    directions={directions}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                />
            )}
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