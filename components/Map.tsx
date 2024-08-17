import Mapbox, { MapView } from "@rnmapbox/maps";

const accessToken = "pk.eyJ1IjoiZnVnZ2VsLWRldiIsImEiOiJjbHp5ZzYybXkweG11MmxzaTRwdnVucDB4In0.KhhCb-EWGrZDHEMw_n3LAA";
Mapbox.setAccessToken(accessToken);

export default function Map() {
    return (
        <MapView
            styleURL="mapbox://styles/mapbox/dark-v11"
            style={{ flex: 1 }}
        />
    );
}
