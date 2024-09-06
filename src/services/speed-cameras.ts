import axios from "axios";
import { OPENSTREETMAP_API } from "@/src/constants/api-constants";
import { boundingBox } from "../utils/map-utils";
import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";
import { DEFAULT_FC } from "../constants/map-constants";
import { SpeedCamera } from "../types/ISpeed";
import { LonLat } from "../types/IMap";

export async function fetchSpeedCameras(params: {
    userLonLat: LonLat;
    distance: number;
}): Promise<FeatureCollection<Geometry, GeometryCollection>> {
    try {
        const { lon, lat } = params.userLonLat;

        const { minLat, minLon, maxLat, maxLon } = boundingBox(lon, lat, params.distance);

        if (!minLat || !minLon || !maxLat || !maxLon) {
            return DEFAULT_FC;
        }

        const overpassQuery = `
            [out:json];
            node["highway"="speed_camera"](${minLat},${minLon},${maxLat},${maxLon});
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

function convertToGeoJSON(overpassData: SpeedCamera): FeatureCollection {
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