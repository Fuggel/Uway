import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { MAP_CONFIG } from "@/constants/map-constants";
import { MapboxStyle } from "@/types/IMap";

import { RootState } from ".";

interface IMapViewState {
    mapboxTheme: MapboxStyle;
    isKalmanFilterEnabled: boolean;
    isSnapToRouteEnabled: boolean;
}

const initialMapViewState: IMapViewState = {
    mapboxTheme: MAP_CONFIG.style,
    isKalmanFilterEnabled: true,
    isSnapToRouteEnabled: true,
};

const mapViewSlice = createSlice({
    name: "mapView",
    initialState: initialMapViewState,
    reducers: {
        mapboxTheme(state, action: PayloadAction<MapboxStyle>) {
            state.mapboxTheme = action.payload;
        },
        setIsKalmanFilterEnabled(state, action: PayloadAction<boolean>) {
            state.isKalmanFilterEnabled = action.payload;
        },
        setIsSnapToRouteEnabled(state, action: PayloadAction<boolean>) {
            state.isSnapToRouteEnabled = action.payload;
        },
    },
});

export const mapViewSelectors = {
    mapboxTheme: (state: RootState): MapboxStyle => state.mapView.mapboxTheme,
    isKalmanFilterEnabled: (state: RootState): boolean => state.mapView.isKalmanFilterEnabled,
    isSnapToRouteEnabled: (state: RootState): boolean => state.mapView.isSnapToRouteEnabled,
};

export const mapViewActions = mapViewSlice.actions;
export default mapViewSlice.reducer;
