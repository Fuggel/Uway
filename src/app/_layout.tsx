import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../store/index";
import Map from "@/src/components/Map";
import { PaperProvider } from "react-native-paper";
import Settings from "../components/Settings";

export default function Layout() {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <PaperProvider>
                    <Settings />
                    <Map />
                </PaperProvider>
            </PersistGate>
        </Provider>
    );
}