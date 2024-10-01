import axios from "axios";
import { OPENSTREETMAP_API } from "@/src/constants/api-constants";
import { boundingBox } from "../utils/map-utils";
import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";
import { DEFAULT_FC } from "../constants/map-constants";
import { Overpass } from "../types/IOverpass";
import { ChargingStationProperties } from "../types/IChargingStation";

export async function fetchChargingStations(params: {
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
            node["amenity"="charging_station"](${minLat},${minLon},${maxLat},${maxLon});
            out body;
            >;
            out skel qt;
        `;

        const url = `${OPENSTREETMAP_API}?data=${encodeURIComponent(overpassQuery)}`;
        const response = await axios.get(url);

        return convertToGeoJSON(response.data) as FeatureCollection<Geometry, GeometryCollection>;
    } catch (error) {
        console.log(`Error fetching charging stations: ${error}`);
        return DEFAULT_FC;
    }
}

function convertToGeoJSON(overpassData: Overpass<ChargingStationProperties>): FeatureCollection {
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
