import { persistReducer, persistStore } from "redux-persist";

import storage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import mapGasStationReduce from "./mapGasStation";
import mapIncidentReduce from "./mapIncident";
import mapNavigationReduce from "./mapNavigation";
import mapParkAvailabilityReduce from "./mapParkAvailability";
import mapSpeedCameraReduce from "./mapSpeedCamera";
import mapSpeedLimitReduce from "./mapSpeedLimit";
import mapViewReducer from "./mapView";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["mapView", "mapSpeedCamera", "mapSpeedLimit", "mapParkAvailability", "mapGasStation", "mapIncident"],
};

const reducer = combineReducers({
    mapView: mapViewReducer,
    mapNavigation: mapNavigationReduce,
    mapSpeedCamera: mapSpeedCameraReduce,
    mapSpeedLimit: mapSpeedLimitReduce,
    mapParkAvailability: mapParkAvailabilityReduce,
    mapGasStation: mapGasStationReduce,
    mapIncident: mapIncidentReduce,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store);
export default store;
