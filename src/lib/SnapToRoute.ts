import { Location } from "@rnmapbox/maps";
import { Position, lineString, point } from "@turf/helpers";

import { SnapToRouteConfig } from "@/types/INavigation";
import { isValidLonLat, removeConsecutiveDuplicates } from "@/utils/map-utils";

import { KalmanFilterWrapper } from "./KalmanFilterWrapper";
import { distance, nearestPointOnLine } from "@turf/turf";

export class SnapToRoute {
    private lastValidLocation: Location | null = null;
    private config: SnapToRouteConfig;
    private kalmanFilter: KalmanFilterWrapper;

    constructor(config: SnapToRouteConfig) {
        this.config = config;
        this.kalmanFilter = new KalmanFilterWrapper();
    }

    public processLocation(location: Location, route: number[][]): Location | null {
        if (!this.isValidLocation(location) && !isValidLonLat(location.coords.longitude, location.coords.latitude)) {
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

        const distanceToRoad = distance([filtered.lon, filtered.lat], snappedPoint, { units: "meters" });

        if (distanceToRoad > this.config.snapRadius) {
            return this.lastValidLocation;
        }

        this.lastValidLocation = {
            coords: {
                ...location.coords,
                longitude: snappedPoint[0],
                latitude: snappedPoint[1],
            },
            timestamp: location.timestamp,
        };

        return this.lastValidLocation;
    }

    private isValidLocation(location: Location): boolean {
        const { accuracy } = location.coords;

        if (accuracy !== undefined && accuracy > this.config.minAccuracy) {
            return false;
        }
        return true;
    }

    private snapToRoute(location: Location, route: number[][]): Position {
        const userPoint = point([location.coords.longitude, location.coords.latitude]);

        const cleanRouteLine = removeConsecutiveDuplicates(route);
        const routeLine = lineString(cleanRouteLine);

        const snapped = nearestPointOnLine(routeLine, userPoint);

        return snapped.geometry.coordinates;
    }
}
