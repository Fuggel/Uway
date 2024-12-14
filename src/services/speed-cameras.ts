import axios from "axios";

import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";

import { API_URL } from "@/constants/api-constants";
import { BoundingBox, LonLat } from "@/types/IMap";
import { Overpass } from "@/types/IOverpass";
import { SpeedCameraProperties } from "@/types/ISpeed";
import { boundingBox } from "@/utils/map-utils";

import { DEFAULT_FC } from "../constants/map-constants";

export async function fetchSpeedCameras(params: {
    userLonLat: LonLat;
    distance: number;
}): Promise<FeatureCollection<Geometry, GeometryCollection>> {
    try {
        if (!params.userLonLat.lon || !params.userLonLat.lat) {
            return DEFAULT_FC;
        }

        const { minLat, minLon, maxLat, maxLon } = boundingBox(params.userLonLat, params.distance) as BoundingBox;

        const overpassQuery = `
            [out:json];
            node["highway"="speed_camera"](${minLat},${minLon},${maxLat},${maxLon});
            out body;
        `;

        const url = `${API_URL.OPENSTREETMAP}?data=${encodeURIComponent(overpassQuery)}`;
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
            return {
                type: "Feature",
                properties: {
                    ...element.tags,
                    name: "Blitzer",
                    address: element.tags.address,
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
