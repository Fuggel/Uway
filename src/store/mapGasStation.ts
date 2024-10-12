import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { RootState } from ".";

interface IMapGasStationState {
    showGasStation: boolean;
}

const initialMapGasStationState: IMapGasStationState = {
    showGasStation: true,
};

const mapGasStationSlice = createSlice({
    name: "mapGasStation",
    initialState: initialMapGasStationState,
    reducers: {
        setShowGasStation(state, action: PayloadAction<boolean>) {
            state.showGasStation = action.payload;
        },
    },
});

export const mapGasStationSelectors = {
    showGasStation: (state: RootState) => state.mapGasStation.showGasStation,
};

export const mapGasStationActions = mapGasStationSlice.actions;
export default mapGasStationSlice.reducer;
