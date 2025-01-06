import { bearing, booleanPointInPolygon, buffer, lineString, point } from "@turf/turf";

import { WarningThresholds, WarningType } from "@/types/INavigation";
import { RelevantFeatureParams } from "@/types/ISpeed";

export class WarningManager {
    private warningThresholds: WarningThresholds;
    private hasPlayedWarning = { early: false, late: false };

    constructor(type: WarningType, speed: number) {
        this.warningThresholds = this.getWarningThresholds(type, speed);
    }

    public checkWarning(
        distanceToFeature: number,
        playWarning: (message: string) => void,
        warningMessage: string,
        relevanceParams?: RelevantFeatureParams
    ) {
        const { early, late } = this.warningThresholds;

        if (relevanceParams && !this.isFeatureRelevant(relevanceParams).isRelevant) {
            return;
        }

        if (!this.hasPlayedWarning.early && distanceToFeature <= early) {
            playWarning(warningMessage);
            this.hasPlayedWarning.early = true;
        } else if (!this.hasPlayedWarning.late && distanceToFeature <= late) {
            playWarning(warningMessage);
            this.hasPlayedWarning.late = true;
        }
    }

    public resetWarnings() {
        this.hasPlayedWarning = { early: false, late: false };
    }

    private getWarningThresholds(type: WarningType, speed: number): WarningThresholds {
        switch (type) {
            case WarningType.ALERT:
                if (speed <= 30) return { early: 300, late: 150 };
                if (speed <= 50) return { early: 500, late: 250 };
                if (speed > 90) return { early: 1500, late: 800 };
                return { early: 800, late: 400 };
            case WarningType.INSTRUCTION:
                if (speed <= 30) return { early: 200, late: 75 };
                if (speed <= 50) return { early: 400, late: 150 };
                if (speed > 90) return { early: 1000, late: 500 };
                return { early: 600, late: 200 };
            default:
                return { early: 0, late: 0 };
        }
    }

    private isFeatureRelevant(params: RelevantFeatureParams): { isRelevant: boolean } {
        const { tolerance, laneThreshold, userPoint, featurePoint, heading, directions, route, routeBufferTolerance } =
            params;

        const userPointGeo = point(userPoint);
        const featurePointGeo = point(featurePoint);

        const bearingToFeature = bearing(userPointGeo, featurePointGeo);
        const angleDifference = this.calculateAngleDifference(heading, bearingToFeature);

        const isAhead = angleDifference <= tolerance;

        const isSameLane = directions
            ? directions.some((dir) => {
                  const oppositeDir = (dir + 180) % 360;
                  return this.calculateAngleDifference(heading, oppositeDir) < laneThreshold;
              })
            : this.calculateAngleDifference(heading, bearingToFeature) < laneThreshold;

        const isOnRoute = route ? this.isFeatureOnRoute(featurePoint, route, routeBufferTolerance) : false;

        const isRelevant = isAhead && isSameLane && isOnRoute;

        return { isRelevant };
    }

    private calculateAngleDifference(angle1: number, angle2: number): number {
        const diff = Math.abs(angle1 - angle2);
        return diff > 180 ? 360 - diff : diff;
    }

    private isFeatureOnRoute(featurePoint: number[], route: number[][], routeBufferTolerance: number): boolean {
        const featurePointGeo = point(featurePoint);
        const routeGeo = lineString(route);
        const bufferedRoute = buffer(routeGeo, routeBufferTolerance, { units: "meters" });

        if (!bufferedRoute) {
            return false;
        }

        return booleanPointInPolygon(featurePointGeo, bufferedRoute);
    }
}
