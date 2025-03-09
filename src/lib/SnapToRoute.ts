import { Location } from "@rnmapbox/maps";
import { Position, lineString, point } from "@turf/helpers";
import { bearing, distance, nearestPointOnLine } from "@turf/turf";

import { SnapToRouteConfig } from "@/types/INavigation";
import { isValidLonLat, removeConsecutiveDuplicates } from "@/utils/map-utils";

import { KalmanFilterWrapper } from "./KalmanFilterWrapper";

export class SnapToRoute {
    private lastValidLocation: Location | null = null;
    private lastHeading: number | null = null;
    private config: SnapToRouteConfig;
    private kalmanFilter: KalmanFilterWrapper;
    private isKalmanFilterEnabled: boolean;
    private isSnapToRouteEnabled: boolean;

    constructor(config: SnapToRouteConfig) {
        this.config = config;
        this.kalmanFilter = new KalmanFilterWrapper();
        this.isKalmanFilterEnabled = config.isKalmanFilterEnabled;
        this.isSnapToRouteEnabled = config.isSnapToRouteEnabled;
    }

    public processLocation(location: Location, route: number[][]): Location | null {
        if (!this.isValidLocation(location) && !isValidLonLat(location.coords.longitude, location.coords.latitude)) {
            return this.lastValidLocation;
        }

        const filtered = this.isKalmanFilterEnabled
            ? this.kalmanFilter.filterLocation({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
              })
            : { lat: location.coords.latitude, lon: location.coords.longitude };

        const snappedPoint = this.snapToRoute(
            {
                ...location,
                coords: { ...location.coords, latitude: filtered.lat, longitude: filtered.lon },
            },
            route
        );

        const distanceToRoad = distance([filtered.lon, filtered.lat], snappedPoint, { units: "meters" });

        if (distanceToRoad > this.config.snapRadius) {
            return {
                ...location,
                coords: {
                    ...location.coords,
                    longitude: filtered.lon,
                    latitude: filtered.lat,
                },
            };
        }

        const heading =
            this.getHeading(snappedPoint, route, location.coords.heading) ??
            this.lastHeading ??
            location.coords.course ??
            0;

        this.lastHeading = heading;

        this.lastValidLocation = {
            coords: {
                ...location.coords,
                longitude: this.isSnapToRouteEnabled ? snappedPoint[0] : filtered.lon,
                latitude: this.isSnapToRouteEnabled ? snappedPoint[1] : filtered.lat,
                course: heading,
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

    private getHeading(snappedPoint: Position, route: number[][], userHeading: number | undefined): number | undefined {
        let closestIndex = -1;
        let minDist = Infinity;

        for (let i = 0; i < route.length; i++) {
            const d = distance(snappedPoint, route[i], { units: "meters" });
            if (d < minDist) {
                minDist = d;
                closestIndex = i;
            }
        }

        if (closestIndex === -1 || closestIndex >= route.length - 1) {
            return userHeading;
        }

        const nextPoint = route[closestIndex + 1];
        const calculatedHeading = bearing([snappedPoint[0], snappedPoint[1]], nextPoint);

        if (userHeading) {
            const headingDifference = Math.abs(userHeading - calculatedHeading);
            if (headingDifference > this.config.maxSnapHeadingDifference) {
                return userHeading;
            }
        }

        return calculatedHeading;
    }
}
