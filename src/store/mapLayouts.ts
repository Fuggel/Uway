import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { RootState } from ".";

interface IMapLayoutsState {
    openSearchModal: boolean;
    openCategoryLocationsList: boolean;
    selectingCategoryLocation: boolean;
    openGasStationsList: boolean;
}

const initialMapLayoutsState: IMapLayoutsState = {
    openSearchModal: false,
    openCategoryLocationsList: false,
    selectingCategoryLocation: false,
    openGasStationsList: false,
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
        setSelectingCategoryLocation: (state, action: PayloadAction<boolean>) => {
            state.selectingCategoryLocation = action.payload;
        },
        setOpenGasStationsList: (state, action: PayloadAction<boolean>) => {
            state.openGasStationsList = action.payload;
        },
    },
});

export const mapLayoutsSelectors = {
    openSearchModal: (state: RootState): boolean => state.mapLayouts.openSearchModal,
    openCategoryLocationsList: (state: RootState): boolean => state.mapLayouts.openCategoryLocationsList,
    selectingCategoryLocation: (state: RootState): boolean => state.mapLayouts.selectingCategoryLocation,
    openGasStationsList: (state: RootState): boolean => state.mapLayouts.openGasStationsList,
};

export const mapLayoutsActions = mapLayoutsSlice.actions;
export default mapLayoutsSlice.reducer;
