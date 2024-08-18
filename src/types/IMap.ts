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