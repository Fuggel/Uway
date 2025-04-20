import axios from "axios";

import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";

import { API } from "@/constants/env-constants";
import { DEFAULT_FC } from "@/constants/map-constants";
import { LonLat } from "@/types/IMap";

export async function fetchIncidents(params: {
    authToken: string;
    userLonLat: LonLat;
}): Promise<FeatureCollection<Geometry, GeometryCollection>> {
    try {
        if (!params.userLonLat.lon || !params.userLonLat.lat) {
            return DEFAULT_FC;
        }

        const queryParams = new URLSearchParams();
        queryParams.append("lon", params.userLonLat.lon.toString());
        queryParams.append("lat", params.userLonLat.lat.toString());

        const url = `${API.UWAY_URL}/incidents?${queryParams.toString()}`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${params.authToken}`,
            },
        });

        return response.data.data;
    } catch (error) {
        console.log(`Error fetching incidents: ${error}`);
        return DEFAULT_FC;
    }
}
