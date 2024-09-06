import { Feature, Point } from "@turf/helpers";
import { MapboxStyle } from "../types/IMap";
import { ManeuverType, Instruction, Incident } from "../types/INavigation";

export function determineMapStyle(styleUrl: MapboxStyle): MapboxStyle {
    switch (styleUrl) {
        case MapboxStyle.NAVIGATION_DARK:
            return MapboxStyle.NAVIGATION_DARK;
        case MapboxStyle.STREETS:
            return MapboxStyle.STREETS;
        case MapboxStyle.DARK:
            return MapboxStyle.DARK;
        case MapboxStyle.LIGHT:
            return MapboxStyle.LIGHT;
        case MapboxStyle.OUTDOORS:
            return MapboxStyle.OUTDOORS;
        case MapboxStyle.SATELLITE:
            return MapboxStyle.SATELLITE;
        case MapboxStyle.SATELLITE_STREETS:
            return MapboxStyle.SATELLITE_STREETS;
        case MapboxStyle.TRAFFIC_DAY:
            return MapboxStyle.TRAFFIC_DAY;
        case MapboxStyle.TRAFFIC_NIGHT:
            return MapboxStyle.TRAFFIC_NIGHT;
        default:
            return MapboxStyle.NAVIGATION_DARK;
    }
}

export function arrowDirection(step: Instruction) {
    switch (step.driving_side) {
        case ManeuverType.CONTINUE:
        case ManeuverType.STRAIGHT:
            return "up";
        case ManeuverType.LEFT:
            return "left";
        case ManeuverType.RIGHT:
            return "right";
        default:
            return undefined;
    }
}

export function isValidLonLat(lon: number, lat: number) {
    return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
}


export function boundingBox(lon: number, lat: number, distance: number) {
    const metersPerDegree = 111111; // Roughly 111 km at the equator
    const latDelta = distance / metersPerDegree;
    const lonDelta = distance / (metersPerDegree * Math.cos(lat * (Math.PI / 180)));

    return {
        minLat: lat - latDelta,
        minLon: lon - lonDelta,
        maxLat: lat + latDelta,
        maxLon: lon + lonDelta
    };
}

export function determineSpeedLimitIcon(speedLimit: string) {
    const assetsUrl = "../assets/images/map-icons";

    switch (speedLimit) {
        case "5":
            return require(`${assetsUrl}/speed-limit-5.png`);
        case "10":
            return require(`${assetsUrl}/speed-limit-10.png`);
        case "15":
            return require(`${assetsUrl}/speed-limit-15.png`);
        case "20":
            return require(`${assetsUrl}/speed-limit-20.png`);
        case "25":
            return require(`${assetsUrl}/speed-limit-25.png`);
        case "30":
            return require(`${assetsUrl}/speed-limit-30.png`);
        case "40":
            return require(`${assetsUrl}/speed-limit-40.png`);
        case "45":
            return require(`${assetsUrl}/speed-limit-45.png`);
        case "50":
            return require(`${assetsUrl}/speed-limit-50.png`);
        case "60":
            return require(`${assetsUrl}/speed-limit-60.png`);
        case "70":
            return require(`${assetsUrl}/speed-limit-70.png`);
        case "80":
            return require(`${assetsUrl}/speed-limit-80.png`);
        case "100":
            return require(`${assetsUrl}/speed-limit-100.png`);
        case "120":
            return require(`${assetsUrl}/speed-limit-120.png`);
        default:
            return require(`${assetsUrl}/speed-limit-unknown.png`);
    }
}

export function incidentsToFeatureCollection(incidents: Incident[]) {
    const features = incidents.map((incident) => {
        return {
            type: "Feature",
            properties: {
                id: incident.id,
                type: incident.type,
                description: incident.description,
                impact: incident.impact,
                subType: incident.sub_type,
            },
            geometry: {
                type: "Point",
                coordinates: [
                    (incident.west + incident.east) / 2,
                    (incident.south + incident.north) / 2,
                ],
            },
        };
    });

    return {
        type: "FeatureCollection",
        features: features as Feature<Point>[],
    };
}