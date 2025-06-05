import { NativeModules } from "react-native";

interface NativeNavigationModule {
    startNavigationService: () => void;
    stopNavigationService: () => void;
}

const NavigationService = NativeModules.NavigationModule as NativeNavigationModule;

export default NavigationService;
