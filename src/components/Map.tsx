import { useEffect, useRef, useState } from "react";
import Mapbox, { Camera, LocationPuck, MapView } from "@rnmapbox/maps";
import { MAP_CONFIG } from "../constants/map-constants";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CameraRef } from "@rnmapbox/maps/lib/typescript/src/components/Camera";
import useUserLocation from "../hooks/useUserLocation";
import { COLORS } from "../constants/colors-constants";
import { SIZES } from "../constants/size-constants";
import { determineMapStyle } from "../utils/map-utils";
import { useSelector } from "react-redux";
import { selectMapboxTheme } from "../store/mapView";
import useDirections from "../hooks/useDirections";
import LineLayer from "./Layers/LineLayer";
import Loading from "./Loading";
import Card from "./Card";
import Searchbar from "./Searchbar";
import useSearchSuggestion from "../hooks/useSearchSuggestion";
import { generateSessionToken } from "../utils/auth-utils";
import { Divider } from "react-native-paper";
import useSearchLocation from "../hooks/useSeachLocation";

Mapbox.setAccessToken(MAP_CONFIG.accessToken);

const sessionToken = generateSessionToken();

export default function Map() {
    const cameraRef = useRef<CameraRef | null>(null);
    const mapStyle = useSelector(selectMapboxTheme);
    const [searchQuery, setSearchQuery] = useState("");
    const [locationId, setLocationId] = useState("");
    const [navigationView, setNavigationView] = useState(false);
    const { userLocation } = useUserLocation();

    const handleCancelNavigation = () => {
        setNavigationView(false);
        setDirections(null);
    };

    const { suggestions } = useSearchSuggestion({ query: searchQuery, sessionToken });
    const { locations } = useSearchLocation({ mapboxId: locationId, sessionToken });
    const { directions, setDirections, loadingDirections } = useDirections({
        profile: "driving",
        startLngLat: { lon: userLocation?.coords.longitude as number, lat: userLocation?.coords.latitude as number },
        destinationLngLat: { lon: locations?.geometry.coordinates[0] as number, lat: locations?.geometry.coordinates[1] as number },
    });

    useEffect(() => {
        if (directions) {
            setNavigationView(true);
            setSearchQuery("");
        }
    }, [directions]);

    return (
        <View style={styles.container}>
            {loadingDirections && <Loading />}

            {!directions &&
                <Searchbar
                    st={styles.search}
                    listSt={styles.suggestions}
                    placeholder="Search for a location"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                >
                    {suggestions?.suggestions
                        .filter(suggestion => suggestion.full_address)
                        .map((suggestion) => (
                            <ScrollView key={suggestion.mapbox_id}>
                                <TouchableOpacity onPress={() => setLocationId(suggestion.mapbox_id)}>
                                    <Text>{suggestion.full_address}</Text>
                                    <Divider style={styles.divider} />
                                </TouchableOpacity>
                            </ScrollView>
                        ))}
                </Searchbar>
            }

            <MapView
                style={styles.map}
                styleURL={determineMapStyle(mapStyle)}
                scaleBarEnabled={false}
                onTouchStart={() => setNavigationView(false)}
            >
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
                    puckBearingEnabled
                    puckBearing="heading"
                    pulsing={{ isEnabled: true }}
                />
                {directions?.geometry?.coordinates && (
                    <LineLayer
                        sourceId="route-source"
                        layerId="route-layer"
                        coordinates={directions.geometry.coordinates}
                    />
                )}
            </MapView>

            <View style={styles.mapButtons}>
                <TouchableOpacity>
                    <MaterialCommunityIcons
                        name="navigation-variant"
                        size={SIZES.iconSize.lg}
                        style={styles.navigationViewButton}
                        onPress={() => setNavigationView((prev) => !prev)}
                        color={navigationView ? COLORS.primary : COLORS.white}
                    />
                </TouchableOpacity>

                {directions?.distance && directions.duration &&
                    <Card st={styles.card}>
                        <View>
                            <Text style={styles.navigationDuration}>
                                {(directions.duration / 60).toFixed(0)} min
                            </Text>
                            <Text style={styles.navigationDistance}>
                                {(directions.distance / 1000).toFixed(2).replace(".", ",")} km · {locations?.properties.address}
                            </Text>
                        </View>

                        <MaterialCommunityIcons
                            name="close-circle"
                            size={50}
                            onPress={handleCancelNavigation}
                            color={COLORS.error}
                        />
                    </Card>
                }
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
    search: {
        position: "absolute",
        top: SIZES.spacing.xl,
        left: SIZES.spacing.md,
        width: "50%",
    },
    suggestions: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: SIZES.spacing.sm,
        marginTop: 2,
        gap: SIZES.spacing.sm,
        borderRadius: SIZES.borderRadius.sm,
        width: "95%",
        marginHorizontal: "auto",
    },
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        paddingVertical: SIZES.spacing.sm,
    },
    navigationButton: {
        marginTop: SIZES.spacing.xs,
        width: 120,
        marginHorizontal: "auto",
    },
    navigationDuration: {
        color: COLORS.success,
        fontSize: SIZES.fontSize.lg,
        fontWeight: "bold",
    },
    navigationDistance: {
        color: COLORS.gray,
        fontSize: SIZES.fontSize.md,
    },
    mapButtons: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        gap: 4,
        zIndex: 999999,
    },
    navigationViewButton: {
        marginLeft: "auto",
        marginRight: SIZES.spacing.md,
        marginBottom: SIZES.spacing.sm,
    },
    divider: {
        marginTop: SIZES.spacing.xs,
    },
});