import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

import NavigationService from "@/native-modules/NavigationService";
import { AppStateType } from "@/types/IAppState";
import { StartNavigation } from "@/types/INavigationService";

const useBackgroundService = (params: StartNavigation) => {
    const appState = useRef(AppState.currentState);
    const [currentState, setCurrentState] = useState(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            appState.current = nextAppState;
            setCurrentState(nextAppState);
        });

        return () => subscription.remove();
    }, []);

    useEffect(() => {
        if (!params.isNavigationEnabled) {
            NavigationService.stopNavigationService();
            return;
        }

        if (currentState === AppStateType.BACKGROUND) {
            NavigationService.startNavigationService(params);
        } else {
            NavigationService.stopNavigationService();
        }
    }, [currentState, params.isNavigationEnabled]);
};

export default useBackgroundService;
