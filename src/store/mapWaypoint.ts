import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { LonLat } from "@/types/IMap";

import { RootState } from ".";

interface IMapWaypointState {
    selectGasStationWaypoint: boolean;
    gasStationWaypoints: LonLat | null;
}

const initialMapWaypointState: IMapWaypointState = {
    selectGasStationWaypoint: false,
    gasStationWaypoints: null,
};

const mapWaypointSlice = createSlice({
    name: "mapWaypoint",
    initialState: initialMapWaypointState,
    reducers: {
        setSelectGasStationWaypoint(state, action: PayloadAction<boolean>) {
            state.selectGasStationWaypoint = action.payload;
        },
        setGasStationWaypoints(state, action: PayloadAction<LonLat>) {
            state.gasStationWaypoints = action.payload;
        },
        removeGasStationWaypoints(state) {
            state.gasStationWaypoints = null;
            state.selectGasStationWaypoint = false;
        },
    },
});

export const mapWaypointSelectors = {
    selectGasStationWaypoint: (state: RootState) => state.mapWaypoint.selectGasStationWaypoint,
    gasStationWaypoints: (state: RootState) => state.mapWaypoint.gasStationWaypoints,
};

export const mapWaypointActions = mapWaypointSlice.actions;
export default mapWaypointSlice.reducer;
