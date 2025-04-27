import axios from "axios";

import { API } from "@/constants/env-constants";
import { LonLat } from "@/types/IMap";

export async function fetchSpeedLimits(params: {
    authToken: string;
    userLonLat: LonLat;
}): Promise<{ distance: number; maxspeed: string } | null> {
    try {
        if (!params.userLonLat.lon || !params.userLonLat.lat) {
            return null;
        }

        const queryParams = new URLSearchParams();
        queryParams.append("lon", params.userLonLat.lon.toString());
        queryParams.append("lat", params.userLonLat.lat.toString());

        const url = `${API.UWAY_URL}/speed-limits?${queryParams.toString()}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${params.authToken}`,
            },
        });

        return response.data.data as { distance: number; maxspeed: string };
    } catch (error) {
        console.log(`Error fetching speed limits: ${error}`);
        return null;
    }
}
