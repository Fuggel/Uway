import { Location } from "@rnmapbox/maps";
import { Position, lineString } from "@turf/helpers";
import * as turf from "@turf/turf";

import { SnapToRouteConfig } from "@/types/INavigation";

import { KalmanFilterWrapper } from "./KalmanFilterWrapper";

export class SnapToRoute {
    private lastValidLocation: Location | null = null;
    private config: SnapToRouteConfig;
    private kalmanFilter: KalmanFilterWrapper;

    constructor(config: SnapToRouteConfig) {
        this.config = config;
        this.kalmanFilter = new KalmanFilterWrapper();
    }

    public processLocation(location: Location, route: number[][]): Location | null {
        if (!this.isValidLocation(location)) {
            return this.lastValidLocation;
        }

        const filtered = this.kalmanFilter.filterLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });

        const snappedPoint = this.snapToRoute(
            {
                ...location,
                coords: { ...location.coords, latitude: filtered.lat, longitude: filtered.lon },
            },
            route
        );

        const distanceToRoad = turf.distance([filtered.lon, filtered.lat], snappedPoint, { units: "meters" });

        if (distanceToRoad > this.config.snapRadius) {
            return this.lastValidLocation;
        }

        this.lastValidLocation = {
            coords: {
                ...location.coords,
                latitude: snappedPoint[1],
                longitude: snappedPoint[0],
            },
            timestamp: location.timestamp,
        };

        return this.lastValidLocation;
    }

    private isValidLocation(location: Location): boolean {
        const { accuracy, speed } = location.coords;

        if (accuracy !== undefined && accuracy > this.config.minAccuracy) {
            return false;
        }

        if (speed !== undefined && speed > this.config.maxSpeedThreshold) {
            return false;
        }

        return true;
    }

    private snapToRoute(location: Location, route: number[][]): Position {
        const point = turf.point([location.coords.longitude, location.coords.latitude]);
        const routeLine = lineString(route);
        const snapped = turf.nearestPointOnLine(routeLine, point);

        return snapped.geometry.coordinates;
    }
}
