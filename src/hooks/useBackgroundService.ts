import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

import { useSplash } from "@/contexts/SplashContext";
import NavigationService from "@/native-modules/NavigationService";
import { AppStateType } from "@/types/IAppState";
import { StartNavigation } from "@/types/INavigationService";

const useBackgroundService = (params: StartNavigation) => {
    const { splashReady } = useSplash();
    const appState = useRef<AppStateStatus>(AppState.currentState);

    useEffect(() => {
        if (!splashReady) return;

        const isAuthenticated = !!params.authToken;

        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (appState.current === nextAppState) return;
            appState.current = nextAppState;

            if (nextAppState === AppStateType.BACKGROUND && isAuthenticated) {
                NavigationService.startNavigationService(params);
            } else {
                NavigationService.stopNavigationService();
            }
        };

        const current = AppState.currentState;
        appState.current = current;

        if (current === AppStateType.BACKGROUND && isAuthenticated) {
            NavigationService.startNavigationService(params);
        } else {
            setTimeout(() => {
                NavigationService.stopNavigationService();
            }, 1000);
        }

        const subscription = AppState.addEventListener("change", handleAppStateChange);

        return () => {
            NavigationService.stopNavigationService();
            subscription.remove();
        };
    }, [splashReady, params.authToken]);
};

export default useBackgroundService;
