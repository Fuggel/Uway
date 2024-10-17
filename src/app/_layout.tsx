import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MapFeatureContextProvider } from "@/contexts/MapFeatureContext";
import { MarkerBottomSheetContextProvider } from "@/contexts/MarkerBottomSheetContext";
import { UserLocationContextProvider } from "@/contexts/UserLocationContext";
import store, { persistor } from "@/store";

const queryClient = new QueryClient();

const RootLayout = () => {
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
                                    </Stack>
                                </MapFeatureContextProvider>
                            </MarkerBottomSheetContextProvider>
                        </UserLocationContextProvider>
                    </QueryClientProvider>
                </PaperProvider>
            </PersistGate>
        </Provider>
    );
};

export default RootLayout;
