import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

import NavigationService from "@/native-modules/NavigationService";
import { AppStateType } from "@/types/IAppState";

const useBackgroundService = (navigationEnabled: boolean) => {
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
        if (!navigationEnabled) {
            NavigationService.stopNavigationService();
            return;
        }

        if (currentState === AppStateType.BACKGROUND) {
            NavigationService.startNavigationService();
        } else {
            NavigationService.stopNavigationService();
        }
    }, [currentState, navigationEnabled]);
};

export default useBackgroundService;
