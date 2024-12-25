import { persistReducer, persistStore } from "redux-persist";

import storage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import mapGasStationReduce from "./mapGasStation";
import mapIncidentReduce from "./mapIncident";
import mapNavigationReduce from "./mapNavigation";
import mapSearchReduce from "./mapSearch";
import mapSpeedCameraReduce from "./mapSpeedCamera";
import mapTextToSpeechReduce from "./mapTextToSpeech";
import mapViewReduce from "./mapView";
import mapWaypointReduce from "./mapWaypoint";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["mapView", "mapSpeedCamera", "mapGasStation", "mapIncident", "mapTextToSpeech", "mapSearch"],
};

const reducer = combineReducers({
    mapView: mapViewReduce,
    mapNavigation: mapNavigationReduce,
    mapSpeedCamera: mapSpeedCameraReduce,
    mapGasStation: mapGasStationReduce,
    mapIncident: mapIncidentReduce,
    mapTextToSpeech: mapTextToSpeechReduce,
    mapSearch: mapSearchReduce,
    mapWaypoint: mapWaypointReduce,
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
