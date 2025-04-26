import axios from "axios";

import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";

import { API } from "@/constants/env-constants";
import { LonLat } from "@/types/IMap";

import { DEFAULT_FC } from "../constants/map-constants";

export async function fetchSpeedLimits(params: {
    authToken: string;
    userLonLat: LonLat;
    distance: number;
}): Promise<FeatureCollection<Geometry, GeometryCollection>> {
    try {
        if (!params.userLonLat.lon || !params.userLonLat.lat || !params.distance) {
            return DEFAULT_FC;
        }

        const queryParams = new URLSearchParams();
        queryParams.append("lon", params.userLonLat.lon.toString());
        queryParams.append("lat", params.userLonLat.lat.toString());
        queryParams.append("distance", params.distance.toString());

        const url = `${API.UWAY_URL}/speed-limits?${queryParams.toString()}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${params.authToken}`,
            },
        });

        return response.data.data;
    } catch (error) {
        console.log(`Error fetching speed limits: ${error}`);
        return DEFAULT_FC;
    }
}
