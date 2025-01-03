import { Position, lineString, point } from "@turf/helpers";
import { bearing, booleanPointInPolygon, buffer, distance } from "@turf/turf";

import { LANE_IMAGES } from "@/constants/map-constants";
import { GasStation } from "@/types/IGasStation";
import { LonLat, MapboxStyle } from "@/types/IMap";
import { InstructionWarningThreshold, Lane, LaneDirection, ManeuverType, ModifierType } from "@/types/INavigation";
import { RelevantFeatureParams } from "@/types/ISpeed";
import { IncidentType } from "@/types/ITraffic";

export function determineMapStyle(styleUrl: MapboxStyle): MapboxStyle {
    switch (styleUrl) {
        case MapboxStyle.NAVIGATION_DARK:
            return MapboxStyle.NAVIGATION_DARK;
        case MapboxStyle.NAVIGATION_LIGHT:
            return MapboxStyle.NAVIGATION_LIGHT;
        case MapboxStyle.SATELLITE_STREETS:
            return MapboxStyle.SATELLITE_STREETS;
        default:
            return MapboxStyle.NAVIGATION_DARK;
    }
}

export function getManeuverImage(maneuver?: ManeuverType, modifier?: ModifierType, degrees?: number) {
    const directionalUrl = "../assets/images/map-icons/directions/directional";
    const roundaboutUrl = "../assets/images/map-icons/directions/roundabout";

    if (!maneuver) {
        return undefined;
    }

    switch (maneuver) {
        case ManeuverType.TURN:
            if (modifier === ModifierType.RIGHT) return require(`${directionalUrl}/turn-right.png`);
            else if (modifier === ModifierType.SHARP_RIGHT) return require(`${directionalUrl}/sharp-right.png`);
            else if (modifier === ModifierType.SLIGHT_RIGHT) return require(`${directionalUrl}/slight-right.png`);
            else if (modifier === ModifierType.LEFT) return require(`${directionalUrl}/turn-left.png`);
            else if (modifier === ModifierType.SHARP_LEFT) return require(`${directionalUrl}/sharp-left.png`);
            else if (modifier === ModifierType.SLIGHT_LEFT) return require(`${directionalUrl}/slight-left.png`);
            else if (modifier === ModifierType.U_TURN) return require(`${directionalUrl}/uturn-left.png`);
            else return undefined;
        case ManeuverType.DEPART:
            if (modifier === ModifierType.STRAIGHT) return require(`${directionalUrl}/depart-straight.png`);
            else if (modifier === ModifierType.RIGHT) return require(`${directionalUrl}/depart-right.png`);
            else if (modifier === ModifierType.SHARP_RIGHT) return require(`${directionalUrl}/depart-right.png`);
            else if (modifier === ModifierType.SLIGHT_RIGHT) return require(`${directionalUrl}/depart-right.png`);
            else if (modifier === ModifierType.LEFT) return require(`${directionalUrl}/depart-left.png`);
            else if (modifier === ModifierType.SHARP_LEFT) return require(`${directionalUrl}/depart-left.png`);
            else if (modifier === ModifierType.SLIGHT_LEFT) return require(`${directionalUrl}/depart-left.png`);
            else return require(`${directionalUrl}/depart-straight.png`);
        case ManeuverType.ARRIVE:
            if (modifier === ModifierType.STRAIGHT) return require(`${directionalUrl}/arrive-straight.png`);
            else if (modifier === ModifierType.RIGHT) return require(`${directionalUrl}/arrive-right.png`);
            else if (modifier === ModifierType.SHARP_RIGHT) return require(`${directionalUrl}/arrive-right.png`);
            else if (modifier === ModifierType.SLIGHT_RIGHT) return require(`${directionalUrl}/arrive-right.png`);
            else if (modifier === ModifierType.LEFT) return require(`${directionalUrl}/arrive-left.png`);
            else if (modifier === ModifierType.SHARP_LEFT) return require(`${directionalUrl}/arrive-left.png`);
            else if (modifier === ModifierType.SLIGHT_LEFT) return require(`${directionalUrl}/arrive-left.png`);
            else return require(`${directionalUrl}/arrive-straight.png`);
        case ManeuverType.MERGE:
            if (modifier === ModifierType.STRAIGHT) return require(`${directionalUrl}/merge-straight.png`);
            else if (modifier === ModifierType.RIGHT) return require(`${directionalUrl}/merge-right.png`);
            else if (modifier === ModifierType.SHARP_RIGHT) return require(`${directionalUrl}/merge-right.png`);
            else if (modifier === ModifierType.SLIGHT_RIGHT) return require(`${directionalUrl}/merge-slight-right.png`);
            else if (modifier === ModifierType.LEFT) return require(`${directionalUrl}/merge-left.png`);
            else if (modifier === ModifierType.SHARP_LEFT) return require(`${directionalUrl}/merge-left.png`);
            else if (modifier === ModifierType.SLIGHT_LEFT) return require(`${directionalUrl}/merge-slight-left.png`);
            else return require(`${directionalUrl}/merge.png`);
        case ManeuverType.ON_RAMP:
        case ManeuverType.OFF_RAMP:
            if (modifier === ModifierType.STRAIGHT) return require(`${directionalUrl}/continue-straight.png`);
            else if (modifier === ModifierType.RIGHT) return require(`${directionalUrl}/turn-right.png`);
            else if (modifier === ModifierType.SHARP_RIGHT) return require(`${directionalUrl}/sharp-right.png`);
            else if (modifier === ModifierType.SLIGHT_RIGHT) return require(`${directionalUrl}/slight-right.png`);
            else if (modifier === ModifierType.LEFT) return require(`${directionalUrl}/turn-left.png`);
            else if (modifier === ModifierType.SHARP_LEFT) return require(`${directionalUrl}/sharp-left.png`);
            else if (modifier === ModifierType.SLIGHT_LEFT) return require(`${directionalUrl}/slight-left.png`);
            else return require(`${directionalUrl}/continue-straight.png`);
        case ManeuverType.FORK:
            if (modifier === ModifierType.STRAIGHT) return require(`${directionalUrl}/fork-straight.png`);
            else if (modifier === ModifierType.RIGHT) return require(`${directionalUrl}/fork-right.png`);
            else if (modifier === ModifierType.SHARP_RIGHT) return require(`${directionalUrl}/fork-right.png`);
            else if (modifier === ModifierType.SLIGHT_RIGHT) return require(`${directionalUrl}/fork-slight-right.png`);
            else if (modifier === ModifierType.LEFT) return require(`${directionalUrl}/fork-left.png`);
            else if (modifier === ModifierType.SHARP_LEFT) return require(`${directionalUrl}/fork-left.png`);
            else if (modifier === ModifierType.SLIGHT_LEFT) return require(`${directionalUrl}/fork-slight-left.png`);
            else return require(`${directionalUrl}/fork.png`);
        case ManeuverType.END_OF_ROAD:
            if (modifier === ModifierType.STRAIGHT) return require(`${directionalUrl}/continue-straight.png`);
            else if (modifier === ModifierType.RIGHT) return require(`${directionalUrl}/end-of-road-right.png`);
            else if (modifier === ModifierType.SHARP_RIGHT) return require(`${directionalUrl}/end-of-road-right.png`);
            else if (modifier === ModifierType.SLIGHT_RIGHT) return require(`${directionalUrl}/end-of-road-right.png`);
            else if (modifier === ModifierType.LEFT) return require(`${directionalUrl}/end-of-road-left.png`);
            else if (modifier === ModifierType.SHARP_LEFT) return require(`${directionalUrl}/end-of-road-left.png`);
            else if (modifier === ModifierType.SLIGHT_LEFT) return require(`${directionalUrl}/end-of-road-left.png`);
            else return undefined;
        case ManeuverType.CONTINUE:
            if (modifier === ModifierType.STRAIGHT) return require(`${directionalUrl}/continue-straight.png`);
            if (modifier === ModifierType.RIGHT) return require(`${directionalUrl}/turn-right.png`);
            if (modifier === ModifierType.SHARP_RIGHT) return require(`${directionalUrl}/sharp-right.png`);
            if (modifier === ModifierType.SLIGHT_RIGHT) return require(`${directionalUrl}/slight-right.png`);
            if (modifier === ModifierType.LEFT) return require(`${directionalUrl}/turn-left.png`);
            if (modifier === ModifierType.SHARP_LEFT) return require(`${directionalUrl}/sharp-left.png`);
            if (modifier === ModifierType.SLIGHT_LEFT) return require(`${directionalUrl}/slight-left.png`);
            else return require(`${directionalUrl}/continue-straight.png`);
        case ManeuverType.ROUNDABOUT:
            if (!degrees) return require(`${roundaboutUrl}/roundabout-anticlockwise.png`);
            else if (degrees >= 140 && degrees <= 220)
                return require(`${roundaboutUrl}/roundabout-anticlockwise-straight.png`);
            else if (degrees >= 45 && degrees <= 135)
                return require(`${roundaboutUrl}/roundabout-anticlockwise-right.png`);
            else if ((degrees >= 0 && degrees <= 40) || (degrees >= 320 && degrees <= 359))
                return require(`${roundaboutUrl}/roundabout-anticlockwise-alt.png`);
            else if (degrees >= 225 && degrees <= 315)
                return require(`${roundaboutUrl}/roundabout-anticlockwise-left.png`);
            else return require(`${roundaboutUrl}/roundabout-anticlockwise.png`);
    }
}

export function getLaneImage(lane: Lane) {
    const { active, active_direction, directions } = lane;

    if (!directions || directions.length === 0) {
        return undefined;
    }

    let imageName = "";

    if (directions.length > 1) {
        switch (true) {
            case directions.includes(LaneDirection.STRAIGHT) &&
                directions.includes(LaneDirection.LEFT) &&
                directions.includes(LaneDirection.RIGHT):
                imageName = "straight-left-right";
                break;
            case directions.includes(LaneDirection.STRAIGHT) && directions.includes(LaneDirection.LEFT):
                imageName = "straight-left";
                break;
            case directions.includes(LaneDirection.STRAIGHT) && directions.includes(LaneDirection.RIGHT):
                imageName = "straight-right";
                break;
            case directions.includes(LaneDirection.LEFT) && directions.includes(LaneDirection.RIGHT):
                imageName = "turn-left-right";
                break;
            default:
                return undefined;
        }
    } else {
        const direction = directions[0];
        switch (direction) {
            case LaneDirection.STRAIGHT:
                imageName = "straight";
                break;
            case LaneDirection.RIGHT:
                imageName = "turn-right";
                break;
            case LaneDirection.SHARP_RIGHT:
                imageName = "sharp-right";
                break;
            case LaneDirection.SLIGHT_RIGHT:
                imageName = "slight-right";
                break;
            case LaneDirection.LEFT:
                imageName = "turn-left";
                break;
            case LaneDirection.SHARP_LEFT:
                imageName = "sharp-left";
                break;
            case LaneDirection.SLIGHT_LEFT:
                imageName = "slight-left";
                break;
            case LaneDirection.U_TURN:
                imageName = "uturn";
                break;
            default:
                return undefined;
        }
    }

    if (active_direction && directions.length > 1) {
        imageName += `-${active_direction}`;
    }

    if (!active) {
        imageName += "-inactive";
    }

    return LANE_IMAGES[imageName];
}

export function isValidLonLat(lon: number | undefined, lat: number | undefined) {
    if (lon === undefined || lat === undefined) {
        return false;
    }
    return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
}

export function boundingBox(lonLat: LonLat, distance: number) {
    if (!lonLat.lon || !lonLat.lat) {
        return;
    }

    const metersPerDegree = 111111; // Roughly 111 km at the equator
    const latDelta = distance / metersPerDegree;
    const lonDelta = distance / (metersPerDegree * Math.cos(lonLat.lat * (Math.PI / 180)));

    return {
        minLat: lonLat.lat - latDelta,
        minLon: lonLat.lon - lonDelta,
        maxLat: lonLat.lat + latDelta,
        maxLon: lonLat.lon + lonDelta,
    };
}

export function determineSpeedLimitIcon(speedLimit: number) {
    const assetsUrl = "../assets/images/map-icons/speed-limits";

    switch (speedLimit) {
        case 5:
            return require(`${assetsUrl}/speed-limit-5.png`);
        case 10:
            return require(`${assetsUrl}/speed-limit-10.png`);
        case 15:
            return require(`${assetsUrl}/speed-limit-15.png`);
        case 20:
            return require(`${assetsUrl}/speed-limit-20.png`);
        case 25:
            return require(`${assetsUrl}/speed-limit-25.png`);
        case 30:
            return require(`${assetsUrl}/speed-limit-30.png`);
        case 40:
            return require(`${assetsUrl}/speed-limit-40.png`);
        case 45:
            return require(`${assetsUrl}/speed-limit-45.png`);
        case 50:
            return require(`${assetsUrl}/speed-limit-50.png`);
        case 60:
            return require(`${assetsUrl}/speed-limit-60.png`);
        case 70:
            return require(`${assetsUrl}/speed-limit-70.png`);
        case 80:
            return require(`${assetsUrl}/speed-limit-80.png`);
        case 100:
            return require(`${assetsUrl}/speed-limit-100.png`);
        case 120:
            return require(`${assetsUrl}/speed-limit-120.png`);
        default:
            return require(`${assetsUrl}/speed-limit-unknown.png`);
    }
}

export function determineIncidentIcon(iconCategory: IncidentType) {
    const assetsUrl = "../assets/images/map-icons/incidents";

    switch (iconCategory) {
        case IncidentType.Accident:
            return require(`${assetsUrl}/incident-accident.png`);
        case IncidentType.Rain:
            return require(`${assetsUrl}/incident-rain.png`);
        case IncidentType.Ice:
            return require(`${assetsUrl}/incident-ice.png`);
        case IncidentType.Jam:
            return require(`${assetsUrl}/incident-jam.png`);
        case IncidentType.RoadWorks:
            return require(`${assetsUrl}/incident-road-works.png`);
        case IncidentType.BrokenDownVehicle:
            return require(`${assetsUrl}/incident-broken-down-vehicle.png`);
        default:
            return require(`${assetsUrl}/incident-caution.png`);
    }
}

export function getStationIcon(stations: GasStation[], price: number) {
    const iconName = "gas-station";

    const totalPrice = stations.reduce((sum, station) => sum + station.diesel, 0);
    const avgPrice = totalPrice / stations.length;
    const diffPercentage = ((price - avgPrice) / avgPrice) * 100;

    if (diffPercentage >= 5) {
        return `${iconName}-expensive`;
    } else if (diffPercentage <= -5) {
        return `${iconName}-cheap`;
    } else {
        return `${iconName}-average`;
    }
}

export function getOrderedGasStations(gasStations: GasStation[] | undefined): GasStation[] {
    if (!gasStations || gasStations.length === 0) return [];

    return gasStations
        .map((station) => {
            const distance = station.dist;
            const dieselPrice = station.diesel;

            const score = distance > 0 ? dieselPrice / distance : Number.MAX_VALUE;

            return {
                ...station,
                score,
            };
        })
        .sort((a, b) => b.score - a.score);
}

export function distanceToPointText(params: { pos1: Position; pos2: Position; }) {
    const point1 = point(params.pos1);
    const point2 = point(params.pos2);

    const distanceInKm = distance(point1, point2, { units: "kilometers" });

    if (distanceInKm >= 1) {
        return `${distanceInKm.toFixed(1)} km`;
    } else {
        const distanceInMeters = distanceInKm * 1000;
        return `${Math.round(distanceInMeters)} m`;
    }
}

export function convertSpeedToKmh(speed: number) {
    return speed * 3.6;
}

export function isFeatureRelevant(params: RelevantFeatureParams) {
    const { tolerance, laneThreshold, userPoint, featurePoint, heading, directions, route, routeBufferTolerance } =
        params;

    const userPointGeo = point(userPoint);
    const featurePointGeo = point(featurePoint);

    const bearingToFeature = bearing(userPointGeo, featurePointGeo);
    const angleDifference = calculateAngleDifference(heading, bearingToFeature);

    const isAhead = angleDifference <= tolerance;

    const isSameLane = directions
        ? directions.some((dir) => {
            const oppositeDir = (dir + 180) % 360;
            return calculateAngleDifference(heading, oppositeDir) < laneThreshold;
        })
        : calculateAngleDifference(heading, bearingToFeature) < laneThreshold;

    const isOnRoute = route ? isFeatureOnRoute(featurePoint, route, routeBufferTolerance) : false;

    const isRelevant = isAhead && isSameLane && isOnRoute;

    return { isRelevant };
}

function calculateAngleDifference(angle1: number, angle2: number) {
    const diff = Math.abs(angle1 - angle2);
    return diff > 180 ? 360 - diff : diff;
}

function isFeatureOnRoute(featurePoint: number[], route: number[][], routeBufferTolerance: number) {
    const featurePointGeo = point(featurePoint);
    const routeGeo = lineString(route);
    const bufferedRoute = buffer(routeGeo, routeBufferTolerance, { units: "meters" });

    if (!bufferedRoute) {
        return false;
    }

    return booleanPointInPolygon(featurePointGeo, bufferedRoute);
}

export function instructionsWarningThresholds(speed: number): InstructionWarningThreshold {
    if (speed <= 30) return { early: 300, late: 150 };
    if (speed <= 50) return { early: 500, late: 150 };
    if (speed > 90) return { early: 2500, late: 500 };
    return { early: 750, late: 250 };
}
