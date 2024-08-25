import axios from "axios";
import { OPENSTREETMAP_API } from "@/src/constants/api-constants";
import { boundingBox } from "../utils/map-utils";
import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";
import { OpenStreetMap } from "../types/IMap";
import { DEFAULT_FC } from "../constants/map-constants";

export async function fetchSpeedCameras(params: {
    userLon: number,
    userLat: number,
    distance: number;
}): Promise<FeatureCollection<Geometry, GeometryCollection>> {
    try {
        const bb = boundingBox(params.userLon, params.userLat, params.distance);

        const swLat = bb.lat - bb.latDelta;
        const swLon = bb.lon - bb.lonDelta;
        const neLat = bb.lat + bb.latDelta;
        const neLon = bb.lon + bb.lonDelta;

        if (!swLat || !swLon || !neLat || !neLon) {
            return DEFAULT_FC;
        }

        const overpassQuery = `
            [out:json];
            node["highway"="speed_camera"](${swLat},${swLon},${neLat},${neLon});
            out body;
        `;

        const url = `${OPENSTREETMAP_API}?data=${encodeURIComponent(overpassQuery)}`;
        const response = await axios.get(url);

        return convertToGeoJSON(response.data) as FeatureCollection<Geometry, GeometryCollection>;
    } catch (error) {
        console.log(`Error fetching speed cameras: ${error}`);
        return DEFAULT_FC;
    }
}

function convertToGeoJSON(overpassData: OpenStreetMap): FeatureCollection {
    return {
        type: "FeatureCollection",
        features: overpassData.elements.map((element) => ({
            type: "Feature",
            properties: element.tags,
            geometry: {
                type: "Point",
                coordinates: [element.lon, element.lat],
            },
        })),
    };
}