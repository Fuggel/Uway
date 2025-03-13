import axios from "axios";

import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";

import { API } from "@/constants/env-constants";
import { LonLat } from "@/types/IMap";

import { DEFAULT_FC } from "../constants/map-constants";

export async function fetchSpeedCameras(params: {
    userLonLat: LonLat;
}): Promise<FeatureCollection<Geometry, GeometryCollection>> {
    try {
        if (!params.userLonLat.lon || !params.userLonLat.lat) {
            return DEFAULT_FC;
        }

        const queryParams = new URLSearchParams();
        queryParams.append("lon", params.userLonLat.lon.toString());
        queryParams.append("lat", params.userLonLat.lat.toString());

        const url = `${API.UWAY_URL}/speed-cameras?${queryParams.toString()}`;
        const response = await axios.get(url);

        return response.data.data;
    } catch (error) {
        console.log(`Error fetching speed cameras: ${error}`);
        return DEFAULT_FC;
    }
}
