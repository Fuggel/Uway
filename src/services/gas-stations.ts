import axios from "axios";

import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";

import { API } from "@/constants/env-constants";
import { DEFAULT_FC } from "@/constants/map-constants";
import { LonLat } from "@/types/IMap";

export async function fetchGasStations(params: {
    authToken: string;
    userLonLat: LonLat;
}): Promise<FeatureCollection<Geometry, GeometryCollection>> {
    try {
        if (!params.userLonLat.lon || !params.userLonLat.lat) {
            return DEFAULT_FC;
        }

        const queryParams = new URLSearchParams();
        queryParams.append("lat", params.userLonLat.lat.toString());
        queryParams.append("lon", params.userLonLat.lon.toString());

        const url = `${API.UWAY_URL}/gas-stations?${queryParams.toString()}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${params.authToken}`,
            },
        });

        return response.data.data as FeatureCollection<Geometry, GeometryCollection>;
    } catch (error) {
        console.log(`Error fetching gas stations: ${error}`);
        return DEFAULT_FC;
    }
}
