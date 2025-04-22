import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { FuelType } from "@/types/IGasStation";

import { RootState } from ".";

interface IMapGasStationState {
    showGasStation: boolean;
    selectedFuelType: FuelType;
}

const initialMapGasStationState: IMapGasStationState = {
    showGasStation: true,
    selectedFuelType: FuelType.DIESEL,
};

const mapGasStationSlice = createSlice({
    name: "mapGasStation",
    initialState: initialMapGasStationState,
    reducers: {
        setShowGasStation(state, action: PayloadAction<boolean>) {
            state.showGasStation = action.payload;
        },
        setSelectedFuelType(state, action: PayloadAction<FuelType>) {
            state.selectedFuelType = action.payload;
        },
    },
});

export const mapGasStationSelectors = {
    showGasStation: (state: RootState) => state.mapGasStation.showGasStation,
    selectedFuelType: (state: RootState) => state.mapGasStation.selectedFuelType,
};

export const mapGasStationActions = mapGasStationSlice.actions;
export default mapGasStationSlice.reducer;
