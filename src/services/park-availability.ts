import axios from "axios";

import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";

import { API_URL } from "@/constants/api-constants";
import { DEFAULT_FC } from "@/constants/map-constants";
import { ParkAvailability } from "@/types/IParking";

export async function fetchParkAvailability(): Promise<FeatureCollection<Geometry, GeometryCollection>> {
    try {
        const url = `${API_URL.PARK}/Hamburg`;
        const response = await axios.get(url);

        return convertToGeoJSON(response.data) as FeatureCollection<Geometry, GeometryCollection>;
    } catch (error) {
        console.log(`Error fetching park availability: ${error}`);
        return DEFAULT_FC;
    }
}

function convertToGeoJSON(data: ParkAvailability): FeatureCollection {
    return {
        type: "FeatureCollection",
        features: data.lots?.map((element) => ({
            type: "Feature",
            properties: element,
            geometry: {
                type: "Point",
                coordinates: [element.coords?.lng, element.coords?.lat],
            },
        })),
    };
}
