import axios from "axios";

import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";

import { API_URL } from "@/constants/api-constants";
import { DEFAULT_FC } from "@/constants/map-constants";
import { LonLat } from "@/types/IMap";
import { SpeedCameraReport } from "@/types/ISpeed";

export async function fetchSpeedCameras(params: {
    userLonLat: LonLat;
}): Promise<FeatureCollection<Geometry, GeometryCollection>> {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append("coordinates", `${params.userLonLat.lon},${params.userLonLat.lat}`);

        const url = `${API_URL.UWAY}/speed-cameras?${queryParams.toString()}`;
        const response = await axios.get(url);

        return response.data.data as Promise<FeatureCollection<Geometry, GeometryCollection>>;
    } catch (error) {
        console.log(`Error fetching speed cameras: ${error}`);
        return DEFAULT_FC;
    }
}

export async function reportSpeedCamera(data: SpeedCameraReport) {
    const response = await axios.post(`${API_URL.UWAY}/report-speed-camera`, data);
    return response.data;
}
