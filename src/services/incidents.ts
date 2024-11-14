import axios from "axios";

import { FeatureCollection, Geometry, GeometryCollection } from "@turf/helpers";

import { TOMTOM_INCIDENTS_API } from "@/constants/api-constants";
import { DEFAULT_FC } from "@/constants/map-constants";
import { BoundingBox, LonLat } from "@/types/IMap";
import { IncidentFeature } from "@/types/ITraffic";
import { boundingBox } from "@/utils/map-utils";

export async function fetchIncidents(params: {
    userLonLat: LonLat;
    distance: number;
}): Promise<FeatureCollection<Geometry, GeometryCollection>> {
    try {
        if (!params.userLonLat.lon || !params.userLonLat.lat) {
            return DEFAULT_FC;
        }

        const { minLat, minLon, maxLat, maxLon } = boundingBox(params.userLonLat, params.distance) as BoundingBox;

        const queryParams = new URLSearchParams();
        queryParams.append("bbox", `${minLon},${minLat},${maxLon},${maxLat}`);
        queryParams.append(
            "fields",
            "{incidents{type,geometry{type,coordinates},properties{iconCategory,probabilityOfOccurrence,from,to,length,delay,startTime,endTime,lastReportTime,events{description,iconCategory}}}}"
        );
        queryParams.append("language", "de-DE");
        queryParams.append("categoryFilter", "0,1,3,4,5,6,9,14");
        queryParams.append("timeValidityFilter", "present");
        queryParams.append("key", process.env.EXPO_PUBLIC_TOMTOM_API_KEY || "");

        const url = `${TOMTOM_INCIDENTS_API}?${queryParams.toString()}`;
        const response = await axios.get(url);

        const features = response.data.incidents || [];

        return {
            type: "FeatureCollection",
            features: features.map((incident: IncidentFeature) => ({
                type: "Feature",
                geometry: incident.geometry,
                properties: incident.properties,
            })),
        };
    } catch (error) {
        console.log(`Error fetching incidents: ${error}`);
        return DEFAULT_FC;
    }
}
