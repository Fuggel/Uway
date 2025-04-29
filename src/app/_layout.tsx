import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import Purchases from "react-native-purchases";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { API } from "@/constants/env-constants";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { BottomSheetContextProvider } from "@/contexts/BottomSheetContext";
import { MapFeatureContextProvider } from "@/contexts/MapFeatureContext";
import { MapInstructionContextProvider } from "@/contexts/MapInstructionContext";
import { SocketContextProvider } from "@/contexts/SocketContext";
import { UserLocationContextProvider } from "@/contexts/UserLocationContext";
import store, { persistor } from "@/store";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
    const [fontsLoaded, error] = useFonts({
        "Lato-Black": require("../assets/fonts/Lato-Black.ttf"),
        "Lato-BlackItalic": require("../assets/fonts/Lato-BlackItalic.ttf"),
        "Lato-Bold": require("../assets/fonts/Lato-Bold.ttf"),
        "Lato-BoldItalic": require("../assets/fonts/Lato-BoldItalic.ttf"),
        "Lato-Italic": require("../assets/fonts/Lato-Italic.ttf"),
        "Lato-Light": require("../assets/fonts/Lato-Light.ttf"),
        "Lato-LightItalic": require("../assets/fonts/Lato-LightItalic.ttf"),
        "Lato-Regular": require("../assets/fonts/Lato-Regular.ttf"),
        "Lato-Thin": require("../assets/fonts/Lato-Thin.ttf"),
        "Lato-ThinItalic": require("../assets/fonts/Lato-ThinItalic.ttf"),
    });

    useEffect(() => {
        if (error) throw error;
        if (fontsLoaded) {
            setTimeout(() => {
                SplashScreen.hideAsync();
            }, 1000);
        }
    }, [fontsLoaded, error]);

    useEffect(() => {
        const configurePurchases = async () => {
            try {
                if (Platform.OS === "ios") {
                    Purchases.configure({ apiKey: API.REVENUE_CAT_IOS });
                } else if (Platform.OS === "android") {
                    Purchases.configure({ apiKey: API.REVENUE_CAT_ANDROID });
                }
            } catch (error) {
                console.log(`Failed to configure Purchases: ${error}`);
            }
        };
        configurePurchases();
    }, []);

    if (!fontsLoaded && !error) return null;

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <PaperProvider>
                    <QueryClientProvider client={queryClient}>
                        <AuthContextProvider>
                            <SocketContextProvider>
                                <UserLocationContextProvider>
                                    <MapInstructionContextProvider>
                                        <BottomSheetContextProvider>
                                            <MapFeatureContextProvider>
                                                <GestureHandlerRootView>
                                                    <Stack>
                                                        <Stack.Screen
                                                            name="(home)/index"
                                                            options={{ headerShown: false }}
                                                        />
                                                        <Stack.Screen
                                                            name="(home)/map"
                                                            options={{ headerShown: false }}
                                                        />
                                                        <Stack.Screen
                                                            name="(home)/paywall"
                                                            options={{ headerShown: false }}
                                                        />
                                                        <Stack.Screen
                                                            name="(modal)/search"
                                                            options={{ presentation: "modal", headerShown: false }}
                                                        />
                                                        <Stack.Screen
                                                            name="(modal)/save-search"
                                                            options={{ presentation: "modal", headerShown: false }}
                                                        />
                                                        <Stack.Screen
                                                            name="settings/index"
                                                            options={{ title: "Einstellungen", headerBackTitle: "Map" }}
                                                        />
                                                        <Stack.Screen
                                                            name="settings/navigation/index"
                                                            options={{ title: "Navigation" }}
                                                        />
                                                        <Stack.Screen
                                                            name="settings/speed-camera/index"
                                                            options={{ title: "Blitzer" }}
                                                        />
                                                        <Stack.Screen
                                                            name="settings/incidents/index"
                                                            options={{ title: "Verkehrsdaten" }}
                                                        />
                                                    </Stack>
                                                </GestureHandlerRootView>
                                            </MapFeatureContextProvider>
                                        </BottomSheetContextProvider>
                                    </MapInstructionContextProvider>
                                </UserLocationContextProvider>
                            </SocketContextProvider>
                        </AuthContextProvider>
                    </QueryClientProvider>
                </PaperProvider>
            </PersistGate>
        </Provider>
    );
}
