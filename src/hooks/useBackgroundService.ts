import { useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";

import NavigationService from "@/native-modules/NavigationService";
import { AppStateType } from "@/types/IAppState";
import { StartNavigation } from "@/types/INavigationService";

const useBackgroundService = (params: StartNavigation) => {
    const appState = useRef(AppState.currentState);
    const [currentState, setCurrentState] = useState(AppState.currentState);
    const hasBeenActiveOnce = useRef(false);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            appState.current = nextAppState;
            setCurrentState(nextAppState);

            if (nextAppState === AppStateType.ACTIVE) {
                hasBeenActiveOnce.current = true;
            }
        });

        return () => subscription.remove();
    }, []);

    useEffect(() => {
        if (Platform.OS !== "android") return;

        if (currentState === AppStateType.BACKGROUND && !!params.authToken && hasBeenActiveOnce.current) {
            NavigationService.startNavigationService(params);
        } else {
            NavigationService.stopNavigationService();
        }
    }, [currentState, params.authToken]);
};

export default useBackgroundService;
