import axios from "axios";
import { OPENSTREETMAP_API } from "@/src/constants/api-constants";
import { boundingBox, reverseGeocode } from "../utils/map-utils";
import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";
import { DEFAULT_FC } from "../constants/map-constants";
import { SpeedCameraProperties } from "../types/ISpeed";
import { Overpass } from "../types/IOverpass";

export async function fetchSpeedCameras(params: {
    userLon: number;
    userLat: number;
    distance: number;
}): Promise<FeatureCollection<Geometry, GeometryCollection>> {
    try {
        const { minLat, minLon, maxLat, maxLon } = boundingBox(params.userLon, params.userLat, params.distance);

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

        return convertToGeoJSON(response.data) as Promise<FeatureCollection<Geometry, GeometryCollection>>;
    } catch (error) {
        console.log(`Error fetching speed cameras: ${error}`);
        return DEFAULT_FC;
    }
}

async function convertToGeoJSON(overpassData: Overpass<SpeedCameraProperties>): Promise<FeatureCollection> {
    const features = await Promise.all(
        overpassData.elements.map(async (element) => {
            const { name, full_address } = await reverseGeocode(element.lon, element.lat);

            return {
                type: "Feature",
                properties: {
                    ...element.tags,
                    name,
                    address: full_address,
                },
                geometry: {
                    type: "Point",
                    coordinates: [element.lon, element.lat],
                },
            };
        })
    );

    return {
        type: "FeatureCollection",
        features: features as FeatureCollection["features"],
    };
}
