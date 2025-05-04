import { Position, point } from "@turf/helpers";
import { distance } from "@turf/turf";

import { COLORS } from "@/constants/colors-constants";
import { LANE_IMAGES } from "@/constants/map-constants";
import { FuelType, GasStation, IconType } from "@/types/IGasStation";
import { MapboxStyle } from "@/types/IMap";
import { Lane, LaneDirection, ManeuverType, ModifierType } from "@/types/INavigation";
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

export function getStationColor(stations: GasStation[], price: number, fuelType: FuelType) {
    const totalPrice = stations.reduce((sum, station) => {
        const fuelPrice = (() => {
            switch (fuelType) {
                case FuelType.DIESEL:
                    return station.diesel;
                case FuelType.E5:
                    return station.e5;
                case FuelType.E10:
                    return station.e10;
                default:
                    return station.diesel;
            }
        })();

        return sum + fuelPrice;
    }, 0);

    const avgPrice = totalPrice / stations.length;

    const diffPercentage = ((price - avgPrice) / avgPrice) * 100;

    if (diffPercentage >= 3) {
        return COLORS.error;
    } else if (diffPercentage <= -3) {
        return COLORS.success;
    } else {
        return COLORS.secondary;
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

export function distanceToPointText(params: { pos1: Position | undefined; pos2: Position | undefined; }) {
    if (!params.pos1 || !params.pos2) {
        return "Entfernung unbekannt";
    }

    const point1 = point(params.pos1);
    const point2 = point(params.pos2);

    const distanceInKm = distance(point1, point2, { units: "kilometers" });

    if (distanceInKm >= 1) {
        return `${parseFloat(distanceInKm.toFixed(1))} km`;
    } else {
        const distanceInMeters = distanceInKm * 1000;
        return `${Math.round(distanceInMeters)} m`;
    }
}

export function readableDistance(distance: number) {
    if (distance >= 1000) {
        return `${parseFloat((distance / 1000).toFixed(1))} km`;
    } else {
        return `${distance.toFixed(1)} m`;
    }
}

export function readableDuration(duration: number) {
    if (isNaN(duration) || duration <= 0) return "0 min";

    const totalMinutes = Math.round(duration / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours >= 1) {
        return `${hours}:${minutes.toString().padStart(2, "0")} h`;
    } else {
        return `${minutes} min`;
    }
}

export function readableStringDuration(duration: string | undefined) {
    if (!duration) return "";

    const totalMinutes = parseInt(duration);
    if (isNaN(totalMinutes)) return "";

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours >= 1) {
        return `${hours}:${minutes.toString().padStart(2, "0")} h`;
    } else {
        return `${minutes} min`;
    }
}

export function readableStringDistance(distance: string | undefined) {
    if (!distance) return "";

    const totalMeters = parseFloat(distance);

    if (isNaN(totalMeters)) return "";

    if (totalMeters < 1) {
        return `${Math.round(totalMeters * 1000)} m`;
    } else {
        return `${parseFloat(totalMeters.toFixed(1))} km`;
    }
}

export function convertSpeedToKmh(speed: number) {
    return speed * 3.6;
}

export function removeConsecutiveDuplicates(lineString: number[][]): number[][] {
    if (!Array.isArray(lineString) || lineString.length < 2) {
        throw new Error("Coordinates must be an array of two or more positions");
    }

    const filtered = lineString.filter((coord, index, array) => {
        if (!Array.isArray(coord) || coord.length !== 2) {
            throw new Error("Each coordinate must be an array of two numbers");
        }

        if (index === 0) return true;

        const [prevX, prevY] = array[index - 1];
        const [currX, currY] = coord;
        return prevX !== currX || prevY !== currY;
    });

    if (filtered.length < 2) {
        const [lon, lat] = lineString[0];
        filtered.push([lon + 0.000001, lat]);
    }

    return filtered;
}

export function getIncidentStatusText(
    startTime?: string,
    endTime?: string,
    lastReportTime?: string
): string | null {
    const now = Date.now();

    if (startTime && endTime) {
        const end = new Date(endTime).getTime();
        const remainingMinutes = Math.floor((end - now) / 60000);

        if (remainingMinutes <= 0) return "Vorübergehend beendet";
        return `Voraussichtlich noch ${remainingMinutes} min`;
    }

    return formatLastReportText(lastReportTime);
}

export function formatLastReportText(lastReportTime?: string): string | null {
    if (!lastReportTime) return null;

    const now = Date.now();
    const last = new Date(lastReportTime).getTime();
    const diffMs = now - last;

    if (diffMs < 0) return null;

    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 3) return "Zuletzt vor wenigen Minuten gemeldet";
    if (diffMinutes < 60) return `Zuletzt vor ${diffMinutes} min gemeldet`;
    if (diffHours < 24) return `Zuletzt vor ${diffHours} Std. gemeldet`;
    if (diffDays === 1) return "Zuletzt gestern gemeldet";
    if (diffDays <= 3) return `Zuletzt vor ${diffDays} Tagen gemeldet`;

    return null;
}

export function getGasStationIcon(iconType: IconType) {
    const assetsUrl = "../assets/images/map-icons/gas-station";

    switch (iconType) {
        case IconType.GAS_STATION_CHEAP:
            return require(`${assetsUrl}/gas-station-cheap.png`);
        case IconType.GAS_STATION_AVERAGE:
            return require(`${assetsUrl}/gas-station-average.png`);
        case IconType.GAS_STATION_EXPENSIVE:
            return require(`${assetsUrl}/gas-station-expensive.png`);
        default:
            return require(`${assetsUrl}/gas-station-average.png`);
    }
}