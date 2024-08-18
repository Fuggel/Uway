import Mapbox from "@rnmapbox/maps";
import { MapConfig } from "../types/IMap";

export const MAP_CONFIG: MapConfig = {
    position: {
        lon: 9.932443474070425,
        lat: 53.54839604442992,
    },
    zoom: 18,
    pitch: 0,
    style: Mapbox.StyleURL.Dark,
    accessToken: String(process.env.EXPO_MAPBOX_ACCESS_TOKEN) || "",
};