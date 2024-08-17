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
    accessToken: "sk.eyJ1IjoiZnVnZ2VsLWRldiIsImEiOiJjbHp5Zzh4enUxM3BnMnFzOHMyMHRnN2lyIn0.7poXg8JTo8tDuMy7PCpsVQ",
};