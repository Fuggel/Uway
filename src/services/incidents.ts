import axios from "axios";
import { TOMTOM_INCIDENTS_API } from "@/src/constants/api-constants";
import { boundingBox } from "../utils/map-utils";
import { IncidentFc } from "../types/ITraffic";

export async function fetchIncidents(
    params: {
        userLon: number,
        userLat: number,
        distance: number;
    }
): Promise<IncidentFc> {
    try {
        const { minLat, minLon, maxLat, maxLon } = boundingBox(params.userLon, params.userLat, params.distance);

        if (!minLat || !minLon || !maxLat || !maxLon) {
            return { type: "FeatureCollection", incidents: [] };
        }

        const queryParams = new URLSearchParams();
        queryParams.append("bbox", `${minLon},${minLat},${maxLon},${maxLat}`);
        queryParams.append("fields", "{incidents{type,geometry{type,coordinates},properties{iconCategory,probabilityOfOccurrence,events{description,iconCategory}}}}");
        queryParams.append("language", "de-DE");
        queryParams.append("categoryFilter", "0,1,3,4,5,6,9,14");
        queryParams.append("timeValidityFilter", "present");
        queryParams.append("key", process.env.EXPO_PUBLIC_TOMTOM_API_KEY || "");

        const url = `${TOMTOM_INCIDENTS_API}?${queryParams.toString()}`;
        const response = await axios.get(url);

        return response.data;
    } catch (error) {
        console.log(`Error fetching incidents: ${error}`);
        return { type: "FeatureCollection", incidents: [] };
    }
}