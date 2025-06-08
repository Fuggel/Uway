import { useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";

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
        if (currentState === AppStateType.BACKGROUND) {
            Platform.OS === "android"
                ? NavigationService.startNavigationService(params)
                : console.log("iOS is not implemented yet...");
        } else {
            Platform.OS === "android"
                ? NavigationService.stopNavigationService()
                : console.log("iOS is not implemented yet...");
        }
    }, [currentState]);
};

export default useBackgroundService;
