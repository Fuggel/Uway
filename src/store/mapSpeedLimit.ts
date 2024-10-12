import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { RootState } from ".";

interface IMapSpeedLimitState {
    showSpeedLimit: boolean;
}

const initialMapSpeedLimitState: IMapSpeedLimitState = {
    showSpeedLimit: true,
};

const mapSpeedLimitSlice = createSlice({
    name: "mapSpeedLimit",
    initialState: initialMapSpeedLimitState,
    reducers: {
        setShowSpeedLimit(state, action: PayloadAction<boolean>) {
            state.showSpeedLimit = action.payload;
        },
    },
});

export const mapSpeedLimitSelectors = {
    showSpeedLimit: (state: RootState) => state.mapSpeedLimit.showSpeedLimit,
};

export const mapSpeedLimitActions = mapSpeedLimitSlice.actions;
export default mapSpeedLimitSlice.reducer;
