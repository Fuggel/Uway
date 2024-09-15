import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "@react-native-async-storage/async-storage";
import mapViewReducer from "./mapView";
import mapNavigationReduce from "./mapNavigation";
import mapSpeedCameraReduce from "./mapSpeedCamera";
import mapSpeedLimitReduce from "./mapSpeedLimit";
import mapParkAvailabilityReduce from "./mapParkAvailability";
import mapChargingStationReduce from "./mapChargingStation";
import mapGasStationReduce from "./mapGasStation";
import mapIncidentReduce from "./mapIncident";
import mapTestingReduce from "./mapTesting";

const persistConfig = {
    key: "root",
    storage,
    whitelist: [
        "mapView",
        "mapSpeedCamera",
        "mapSpeedLimit",
        "mapParkAvailability",
        "mapChargingStation",
        "mapGasStation",
        "mapIncident",
        "mapTesting",
    ],
};

const reducer = combineReducers({
    mapView: mapViewReducer,
    mapNavigation: mapNavigationReduce,
    mapSpeedCamera: mapSpeedCameraReduce,
    mapSpeedLimit: mapSpeedLimitReduce,
    mapParkAvailability: mapParkAvailabilityReduce,
    mapChargingStation: mapChargingStationReduce,
    mapGasStation: mapGasStationReduce,
    mapIncident: mapIncidentReduce,
    mapTesting: mapTestingReduce,
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