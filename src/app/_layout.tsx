import Map from "@/src/components/Map";
import { PaperProvider } from "react-native-paper";
import Settings from "../components/Settings";
import { useState } from "react";
import { MapStyle } from "../types/IMap";

export default function Layout() {
    const [mapStyle, setMapStyle] = useState(MapStyle.NAVIGATION_DARK);

    return (
        <PaperProvider>
            <Settings mapStyle={mapStyle} setMapStyle={setMapStyle} />
            <Map mapStyle={mapStyle} />
        </PaperProvider>
    );
}