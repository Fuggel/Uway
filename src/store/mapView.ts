import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { MAP_CONFIG } from "@/constants/map-constants";
import { MapboxStyle } from "@/types/IMap";

import { RootState } from ".";

interface IMapViewState {
    mapboxTheme: MapboxStyle;
}

const initialMapViewState: IMapViewState = {
    mapboxTheme: MAP_CONFIG.style,
};

const mapViewSlice = createSlice({
    name: "mapView",
    initialState: initialMapViewState,
    reducers: {
        mapboxTheme(state, action: PayloadAction<MapboxStyle>) {
            state.mapboxTheme = action.payload;
        },
    },
});

export const mapViewSelectors = {
    mapboxTheme: (state: RootState): MapboxStyle => state.mapView.mapboxTheme,
};

export const mapViewActions = mapViewSlice.actions;
export default mapViewSlice.reducer;
