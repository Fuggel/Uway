import axios from "axios";

import { API } from "@/constants/env-constants";
import { Auth } from "@/types/IAuth";

export async function fetchToken(params: { rcUserId: string }): Promise<Auth> {
    try {
        if (!params.rcUserId) {
            return { token: null };
        }

        const queryParams = new URLSearchParams();
        queryParams.append("rcUserId", params.rcUserId.toString());

        const url = `${API.UWAY_URL}/get-token?${queryParams.toString()}`;
        const response = await axios.get(url);

        return response.data;
    } catch (error) {
        console.log(`Error fetching token: ${error}`);
        return { token: null };
    }
}
