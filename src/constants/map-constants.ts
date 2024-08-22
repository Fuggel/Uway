import { MapboxStyle, MapConfig } from "../types/IMap";

export const MAP_CONFIG: MapConfig = {
    position: {
        lon: 9.932443474070425,
        lat: 53.54839604442992,
    },
    zoom: 18,
    pitch: 0,
    followZoom: 20,
    followPitch: 50,
    style: MapboxStyle.NAVIGATION_DARK,
};