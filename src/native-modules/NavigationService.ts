import { NativeModules } from "react-native";

import { StartNavigation } from "@/types/INavigationService";

interface NativeNavigationModule {
    startNavigationService: (params: StartNavigation) => void;
    stopNavigationService: () => void;
}

const NavigationService = NativeModules.NavigationModule as NativeNavigationModule;

export default NavigationService;
