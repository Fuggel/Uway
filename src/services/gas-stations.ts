import axios from "axios";

import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";

import { API_URL } from "@/constants/api-constants";
import { API_KEY } from "@/constants/env-constants";
import { DEFAULT_FC } from "@/constants/map-constants";
import { GasStation } from "@/types/IGasStation";
import { LonLat } from "@/types/IMap";

export async function fetchGasStations(params: {
    userLonLat: LonLat;
    radius: number;
}): Promise<FeatureCollection<Geometry, GeometryCollection>> {
    try {
        if (!params.userLonLat.lon || !params.userLonLat.lat) {
            return DEFAULT_FC;
        }

        const queryParams = new URLSearchParams();
        queryParams.append("lat", params.userLonLat.lat.toString());
        queryParams.append("lng", params.userLonLat.lon.toString());
        queryParams.append("rad", params.radius.toString());
        queryParams.append("sort", "dist");
        queryParams.append("type", "all");
        queryParams.append("apikey", API_KEY.TANKERKOENIG);

        const url = `${API_URL.TANKERKOENIG}?${queryParams.toString()}`;

        const response = await axios.get(url);

        return convertToGeoJSON(response.data) as FeatureCollection<Geometry, GeometryCollection>;
    } catch (error) {
        console.log(`Error fetching gas stations: ${error}`);
        return DEFAULT_FC;
    }
}

function convertToGeoJSON(data: { stations: GasStation[] }): FeatureCollection {
    return {
        type: "FeatureCollection",
        features: data.stations.map((element) => ({
            type: "Feature",
            properties: { ...element },
            geometry: {
                type: "Point",
                coordinates: [element.lng, element.lat],
            },
        })),
    };
}
