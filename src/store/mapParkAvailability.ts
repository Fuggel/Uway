import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { RootState } from ".";

interface IMapParkAvailabilityState {
    showParkAvailability: boolean;
}

const initialMapParkAvailabilityState: IMapParkAvailabilityState = {
    showParkAvailability: true,
};

const mapParkAvailabilitySlice = createSlice({
    name: "mapParkAvailability",
    initialState: initialMapParkAvailabilityState,
    reducers: {
        setShowParkAvailability(state, action: PayloadAction<boolean>) {
            state.showParkAvailability = action.payload;
        },
    },
});

export const mapParkAvailabilitySelectors = {
    showParkAvailability: (state: RootState) => state.mapParkAvailability.showParkAvailability,
};

export const mapParkAvailabilityActions = mapParkAvailabilitySlice.actions;
export default mapParkAvailabilitySlice.reducer;
