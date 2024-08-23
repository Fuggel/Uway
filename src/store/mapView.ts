import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { MapboxStyle } from "../types/IMap";
import { MAP_CONFIG } from "../constants/map-constants";

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

export const selectMapboxTheme = (state: RootState) => state.mapView.mapboxTheme;

export const mapViewActions = mapViewSlice.actions;
export default mapViewSlice.reducer;
