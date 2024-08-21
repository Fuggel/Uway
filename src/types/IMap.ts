export interface MapConfig {
    position: {
        lon: number;
        lat: number;
    };
    zoom: number;
    pitch: number;
    followZoom: number;
    followPitch: number;
    style: string;
}

export enum MapStyle {
    NAVIGATION_DARK = "navigation-dark",
    STREET = "street",
    DARK = "dark",
    LIGHT = "light",
    OUTDOORS = "outdoors",
    SATELLITE = "satellite",
    SATELLITE_STREET = "satellite-street",
    TRAFFIC_DAY = "traffic-day",
    TRAFFIC_NIGHT = "traffic-night",
}

export enum MapboxStyle {
    NAVIGATION_DARK = "mapbox://styles/fuggel-dev/clzzy4fvv005s01qs235m7rhi",
    STREET = "mapbox://styles/mapbox/streets-v11",
    DARK = "mapbox://styles/mapbox/dark-v10",
    LIGHT = "mapbox://styles/mapbox/light-v10",
    OUTDOORS = "mapbox://styles/mapbox/outdoors-v11",
    SATELLITE = "mapbox://styles/mapbox/satellite-v9",
    SATELLITE_STREET = "mapbox://styles/mapbox/satellite-streets-v11",
    TRAFFIC_DAY = "mapbox://styles/mapbox/navigation-preview-day-v4",
    TRAFFIC_NIGHT = "mapbox://styles/mapbox/navigation-preview-night-v4",
}