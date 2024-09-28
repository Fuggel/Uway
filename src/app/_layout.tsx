import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../store/index";
import Map from "@/src/components/map/Map";
import { PaperProvider } from "react-native-paper";
import Settings from "../components/settings/Settings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SettingsContextProvider } from "../contexts/SettingsContext";

const queryClient = new QueryClient();

export default function Layout() {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <PaperProvider>
                    <QueryClientProvider client={queryClient}>
                        <SettingsContextProvider>
                            <Map />
                            <Settings />
                        </SettingsContextProvider>
                    </QueryClientProvider>
                </PaperProvider>
            </PersistGate>
        </Provider>
    );
}
