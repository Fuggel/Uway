import KalmanFilter from "kalmanjs";

import { Position } from "@/types/IMap";

export class KalmanFilterWrapper {
    private kalmanLat: KalmanFilter;
    private kalmanLon: KalmanFilter;

    constructor() {
        this.kalmanLat = new KalmanFilter({ R: 0.01, Q: 3 });
        this.kalmanLon = new KalmanFilter({ R: 0.01, Q: 3 });
    }

    public filterLocation(params: { latitude: number; longitude: number }): Position {
        return {
            lon: this.kalmanLon.filter(params.longitude),
            lat: this.kalmanLat.filter(params.latitude),
        };
    }
}
