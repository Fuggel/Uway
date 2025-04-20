import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { RootState } from ".";

interface IRevenueCatState {
    rcUserId: string | null;
}

const initialRevenueCatState: IRevenueCatState = {
    rcUserId: null,
};

const revenueCatSlice = createSlice({
    name: "revenueCat",
    initialState: initialRevenueCatState,
    reducers: {
        setRcUserId(state, action: PayloadAction<string | null>) {
            state.rcUserId = action.payload;
        },
    },
});

export const revenueCatSelectors = {
    getRcUserId: (state: RootState) => state.revenueCat.rcUserId,
};

export const revenueCatActions = revenueCatSlice.actions;
export default revenueCatSlice.reducer;
