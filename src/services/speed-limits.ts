import axios from "axios";

import { Feature, FeatureCollection, Geometry, GeometryCollection, LineString } from "@turf/helpers";

import { API_URL } from "@/constants/api-constants";
import { DEFAULT_FC } from "@/constants/map-constants";
import { BoundingBox, LonLat } from "@/types/IMap";
import { Overpass } from "@/types/IOverpass";
import { SpeedLimitProperties } from "@/types/ISpeed";
import { boundingBox } from "@/utils/map-utils";

export async function fetchSpeedLimits(params: {
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
            way
                ["highway"]
                ["maxspeed"]
                (${minLat},${minLon},${maxLat},${maxLon});
            out body;
            >;
            out skel qt;
        `;

        const url = `${API_URL.OPENSTREETMAP}?data=${encodeURIComponent(overpassQuery)}`;
        const response = await axios.get(url);

        return convertToGeoJSON(response.data) as FeatureCollection<Geometry, GeometryCollection>;
    } catch (error) {
        console.log(`Error fetching speed limits: ${error}`);
        return DEFAULT_FC;
    }
}

function convertToGeoJSON(data: Overpass<SpeedLimitProperties>) {
    const features = data.elements
        .filter((element) => element.type === "way")
        .map((way) => {
            const coordinates = way.nodes?.map((nodeId) => {
                const node = data.elements?.find((e) => e.type === "node" && e.id === nodeId);
                return [node?.lon, node?.lat];
            });
            return {
                type: "Feature",
                properties: {
                    maxspeed: way.tags.maxspeed,
                    name: way.tags.name,
                },
                geometry: {
                    type: "LineString",
                    coordinates: coordinates,
                },
            };
        });

    return {
        type: "FeatureCollection",
        features: features as Feature<LineString>[],
    };
}
