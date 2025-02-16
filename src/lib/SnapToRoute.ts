import { Location } from "@rnmapbox/maps";
import { Position, lineString } from "@turf/helpers";
import * as turf from "@turf/turf";

import { SnapToRouteConfig } from "@/types/INavigation";

export class SnapToRoute {
    private lastValidLocation: Location | null = null;
    private config: SnapToRouteConfig;

    constructor(config: SnapToRouteConfig) {
        this.config = config;
    }

    public processLocation(location: Location, route: number[][]): Location | null {
        if (!this.isValidLocation(location)) {
            return this.lastValidLocation;
        }

        const snappedPoint = this.snapToRoute(location, route);
        const distanceToRoad = turf.distance([location.coords.longitude, location.coords.latitude], snappedPoint, {
            units: "meters",
        });

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
