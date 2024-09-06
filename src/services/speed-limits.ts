import axios from "axios";
import { OPENSTREETMAP_API } from "@/src/constants/api-constants";
import { boundingBox } from "../utils/map-utils";
import { Feature, FeatureCollection, Geometry, GeometryCollection, LineString } from "@turf/helpers";
import { DEFAULT_FC } from "../constants/map-constants";
import { SpeedLimitProperties } from "../types/ISpeed";
import { Overpass } from "../types/IOverpass";

export async function fetchSpeedLimits(params: {
    userLon: number,
    userLat: number,
    distance: number;
}): Promise<FeatureCollection<Geometry, GeometryCollection>> {
    try {
        const { minLat, minLon, maxLat, maxLon } = boundingBox(params.userLon, params.userLat, params.distance);

        if (!minLat || !minLon || !maxLat || !maxLon) {
            return DEFAULT_FC;
        }

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

        const url = `${OPENSTREETMAP_API}?data=${encodeURIComponent(overpassQuery)}`;
        const response = await axios.get(url);

        return convertToGeoJSON(response.data) as FeatureCollection<Geometry, GeometryCollection>;
    } catch (error) {
        console.log(`Error fetching speed limits: ${error}`);
        return DEFAULT_FC;
    }
}

function convertToGeoJSON(data: Overpass<SpeedLimitProperties>) {
    const features = data.elements
        .filter(element => element.type === "way")
        .map(way => {
            const coordinates = way.nodes?.map(nodeId => {
                const node = data.elements?.find(e => e.type === "node" && e.id === nodeId);
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