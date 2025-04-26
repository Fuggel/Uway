import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";

import { REFETCH_INTERVAL } from "@/constants/env-constants";
import { fetchToken } from "@/services/auth";
import { revenueCatSelectors } from "@/store/revenueCat";
import { Auth } from "@/types/IAuth";

const AUTH_TOKEN_KEY = "authToken";

const useAuth = () => {
    const [authToken, setAuthToken] = useState<Auth | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const rcUserId = useSelector(revenueCatSelectors.getRcUserId);

    const {
        data,
        isLoading: loadingToken,
        error: errorToken,
    } = useQuery({
        queryKey: ["auth", rcUserId],
        queryFn: () => fetchToken({ rcUserId: String(rcUserId) }),
        enabled: isInitialized && !authToken && !!rcUserId,
        staleTime: Infinity,
        refetchInterval: REFETCH_INTERVAL.AUTH_TOKEN_IN_HOURS,
    });

    useEffect(() => {
        const getStoredToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

                if (storedToken) {
                    const parsedToken: Auth = JSON.parse(storedToken);

                    if (parsedToken?.expiresIn && Date.now() < new Date(parsedToken.expiresIn).getTime()) {
                        setAuthToken(parsedToken);
                    } else {
                        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
                        setAuthToken(null);
                    }
                }
            } catch (error) {
                console.log(`Error reading auth token from AsyncStorage: ${error}`);
            } finally {
                setIsInitialized(true);
            }
        };

        getStoredToken();
    }, []);

    useEffect(() => {
        if (data) {
            setAuthToken(data);
            AsyncStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(data));
        } else {
            setAuthToken(null);
        }
    }, [data, rcUserId]);

    return { authToken, loadingToken, errorToken };
};

export default useAuth;
