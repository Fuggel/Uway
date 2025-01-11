import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { RootState } from ".";

interface IMapLayoutsState {
    openSearchModal: boolean;
}

const initialMapLayoutsState: IMapLayoutsState = {
    openSearchModal: false,
};

const mapLayoutsSlice = createSlice({
    name: "mapLayouts",
    initialState: initialMapLayoutsState,
    reducers: {
        setOpenSearchModal: (state, action: PayloadAction<boolean>) => {
            state.openSearchModal = action.payload;
        },
    },
});

export const mapLayoutsSelectors = {
    openSearchModal: (state: RootState): boolean => state.mapLayouts.openSearchModal,
};

export const mapLayoutsActions = mapLayoutsSlice.actions;
export default mapLayoutsSlice.reducer;
