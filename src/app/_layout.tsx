import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../store/index";
import Map from "@/src/components/Map";
import { PaperProvider } from "react-native-paper";
import Settings from "../components/Settings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Layout() {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <PaperProvider>
                    <QueryClientProvider client={queryClient}>
                        <Map />
                        <Settings />
                    </QueryClientProvider>
                </PaperProvider>
            </PersistGate>
        </Provider>
    );
}