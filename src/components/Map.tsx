import { useRef, useState } from "react";
import Mapbox, { Camera, LocationPuck, MapView } from "@rnmapbox/maps";
import { MAP_CONFIG } from "../constants/map-constants";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { CameraRef } from "@rnmapbox/maps/lib/typescript/src/components/Camera";
import useUserLocation from "../hooks/useUserLocation";
import { COLORS } from "../constants/colors-constants";
import { SIZES } from "../constants/size-constants";
import { determineMapStyle } from "../utils/mapStyle";
import { useSelector } from "react-redux";
import { selectMapboxTheme } from "../store/mapView";

Mapbox.setAccessToken("pk.eyJ1IjoiZnVnZ2VsLWRldiIsImEiOiJjbHp5ZzYybXkweG11MmxzaTRwdnVucDB4In0.KhhCb-EWGrZDHEMw_n3LAA");

export default function Map() {
    const cameraRef = useRef<CameraRef | null>(null);
    const mapStyle = useSelector(selectMapboxTheme);
    const [navigationView, setNavigationView] = useState(false);
    const { userLocation } = useUserLocation();

    return (
        <View style={styles.container}>
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
            </MapView>
            <TouchableOpacity style={styles.button}>
                <MaterialCommunityIcons
                    name="navigation-variant"
                    size={SIZES.iconSize.lg}
                    onPress={() => setNavigationView((prev) => !prev)}
                    color={navigationView ? COLORS.primary : COLORS.white}
                />
            </TouchableOpacity>
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
    button: {
        position: "absolute",
        bottom: 20,
        right: 20,
    },
});