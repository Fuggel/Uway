import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { RootState } from ".";

interface IMapLayoutsState {
    openSearchModal: boolean;
    openCategoryLocationsList: boolean;
}

const initialMapLayoutsState: IMapLayoutsState = {
    openSearchModal: false,
    openCategoryLocationsList: false,
};

const mapLayoutsSlice = createSlice({
    name: "mapLayouts",
    initialState: initialMapLayoutsState,
    reducers: {
        setOpenSearchModal: (state, action: PayloadAction<boolean>) => {
            state.openSearchModal = action.payload;
        },
        setOpenCategoryLocationsList: (state, action: PayloadAction<boolean>) => {
            state.openCategoryLocationsList = action.payload;
        },
    },
});

export const mapLayoutsSelectors = {
    openSearchModal: (state: RootState): boolean => state.mapLayouts.openSearchModal,
    openCategoryLocationsList: (state: RootState): boolean => state.mapLayouts.openCategoryLocationsList,
};

export const mapLayoutsActions = mapLayoutsSlice.actions;
export default mapLayoutsSlice.reducer;
