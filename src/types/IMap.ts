export interface MapConfig {
    position: {
        lon: number;
        lat: number;
    };
    zoom: number;
    pitch: number;
    style: string;
    accessToken: string;
}