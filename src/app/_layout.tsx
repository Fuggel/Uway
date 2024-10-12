import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MarkerBottomSheetContextProvider } from "@/contexts/MarkerBottomSheetContext";
import { SettingsContextProvider } from "@/contexts/SettingsContext";
import { UserLocationContextProvider } from "@/contexts/UserLocationContext";
import store, { persistor } from "@/store";

import Map from "@/components/map/Map";
import Settings from "@/components/settings/Settings";

const queryClient = new QueryClient();

const Layout = () => {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <PaperProvider>
                    <QueryClientProvider client={queryClient}>
                        <SettingsContextProvider>
                            <UserLocationContextProvider>
                                <MarkerBottomSheetContextProvider>
                                    <Map />
                                </MarkerBottomSheetContextProvider>
                            </UserLocationContextProvider>
                            <Settings />
                        </SettingsContextProvider>
                    </QueryClientProvider>
                </PaperProvider>
            </PersistGate>
        </Provider>
    );
};

export default Layout;
