import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

interface IMapChargingStationState {
    showChargingStation: boolean;
}

const initialMapChargingStationState: IMapChargingStationState = {
    showChargingStation: true,
};

const mapChargingStationSlice = createSlice({
    name: "mapChargingStation",
    initialState: initialMapChargingStationState,
    reducers: {
        setShowChargingStation(state, action: PayloadAction<boolean>) {
            state.showChargingStation = action.payload;
        },
    },
});

export const mapChargingStationSelectors = {
    showChargingStation: (state: RootState) => state.mapChargingStation.showChargingStation,
};

export const mapChargingStationActions = mapChargingStationSlice.actions;
export default mapChargingStationSlice.reducer;