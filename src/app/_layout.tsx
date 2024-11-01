import { Stack } from "expo-router";
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

const queryClient = new QueryClient();

export default function RootLayout() {
    useEffect(() => {
        const configurePurchases = async () => {
            try {
                if (Platform.OS === "ios") {
                    Purchases.configure({ apiKey: String(process.env.EXPO_PUBLIC_RC_IOS) });
                } else if (Platform.OS === "android") {
                    Purchases.configure({ apiKey: String(process.env.EXPO_PUBLIC_RC_ANDROID) });
                }
                const offerings = await Purchases.getOfferings();
                console.log(JSON.stringify(offerings, null, 2));
            } catch (error) {
                console.log("Error configuring RevenueCat:", error);
            }
        };
        configurePurchases();
    }, []);

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <PaperProvider>
                    <QueryClientProvider client={queryClient}>
                        <UserLocationContextProvider>
                            <MarkerBottomSheetContextProvider>
                                <MapFeatureContextProvider>
                                    <Stack screenOptions={{ headerShown: false }}>
                                        <Stack.Screen name="index" />
                                        <Stack.Screen name="settings" />
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
