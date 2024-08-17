import Mapbox, { Camera, LocationPuck, MapView } from "@rnmapbox/maps";
import { MAP_CONFIG } from "../constants/map-constants";
import useCheckLocationPermission from "../hooks/useCheckLocationPermission";

Mapbox.setAccessToken(MAP_CONFIG.accessToken);

export default function Map() {
    const { hasLocationPermission } = useCheckLocationPermission();

    return (
        <MapView style={{ flex: 1 }} styleURL={MAP_CONFIG.style} scaleBarEnabled={false}>
            <Camera
                followUserLocation={hasLocationPermission}
                followZoomLevel={20}
                followPitch={50}
                zoomLevel={MAP_CONFIG.zoom}
                pitch={MAP_CONFIG.pitch}
                centerCoordinate={[MAP_CONFIG.position.lon, MAP_CONFIG.position.lat]}
            />
            <LocationPuck
                puckBearingEnabled
                puckBearing="heading"
                pulsing={{ isEnabled: true }}
            />
        </MapView>
    );
}
