import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { PaperProvider } from "react-native-paper";
import Purchases from "react-native-purchases";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MapFeatureContextProvider } from "@/contexts/MapFeatureContext";
import { MarkerBottomSheetContextProvider } from "@/contexts/MarkerBottomSheetContext";
import { UserLocationContextProvider } from "@/contexts/UserLocationContext";
import store, { persistor } from "@/store";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
    const [fontsLoaded, error] = useFonts({
        Inter: require("../assets/fonts/Inter-VariableFont.ttf"),
    });

    useEffect(() => {
        if (error) throw error;
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded, error]);

    useEffect(() => {
        const configurePurchases = async () => {
            try {
                if (Platform.OS === "ios") {
                    Purchases.configure({ apiKey: String(process.env.EXPO_PUBLIC_RC_IOS) });
                } else if (Platform.OS === "android") {
                    Purchases.configure({ apiKey: String(process.env.EXPO_PUBLIC_RC_ANDROID) });
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
                        <UserLocationContextProvider>
                            <MarkerBottomSheetContextProvider>
                                <MapFeatureContextProvider>
                                    <Stack>
                                        <Stack.Screen name="(home)/index" options={{ headerShown: false }} />
                                        <Stack.Screen name="(home)/map" options={{ headerShown: false }} />
                                        <Stack.Screen name="(home)/paywall" options={{ headerShown: false }} />
                                        <Stack.Screen
                                            name="settings/index"
                                            options={{ title: "Einstellungen", headerBackTitle: "Map" }}
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
                                </MapFeatureContextProvider>
                            </MarkerBottomSheetContextProvider>
                        </UserLocationContextProvider>
                    </QueryClientProvider>
                </PaperProvider>
            </PersistGate>
        </Provider>
    );
}
