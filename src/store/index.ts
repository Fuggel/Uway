import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "@react-native-async-storage/async-storage";
import mapViewReducer from "./mapView";
import mapNavigationReduce from "./mapNavigation";
import mapSpeedCameraReduce from "./mapSpeedCamera";
import mapParkAvailabilityReduce from "./mapParkAvailability";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["mapView", "mapSpeedCamera", "mapParkAvailability"],
};

const reducer = combineReducers({
    mapView: mapViewReducer,
    mapNavigation: mapNavigationReduce,
    mapSpeedCamera: mapSpeedCameraReduce,
    mapParkAvailability: mapParkAvailabilityReduce,
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