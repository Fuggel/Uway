import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { ExcludeType, ExcludeTypes } from "@/types/INavigation";

import { RootState } from ".";

interface IMapExcludeNavigationState {
    excludeTypes: ExcludeTypes;
}

const initExcludeialMapNavigationState: IMapExcludeNavigationState = {
    excludeTypes: {
        [ExcludeType.TOLL]: false,
        [ExcludeType.MOTORWAY]: false,
        [ExcludeType.FERRY]: true,
        [ExcludeType.UNPAVED]: false,
        [ExcludeType.CASH_ONLY_TOLLS]: false,
    },
};

const mapExcludeNavigationSlice = createSlice({
    name: "mapNExcludeavigation",
    initialState: initExcludeialMapNavigationState,
    reducers: {
        setExcludeTypes(state, action: PayloadAction<ExcludeTypes>) {
            state.excludeTypes = action.payload;
        },
    },
});

export const mapExcludeNavigationSelectors = {
    excludeTypes: (state: RootState): ExcludeTypes => state.mapExcludeNavigation.excludeTypes,
};

export const mapExcludeNavigationActions = mapExcludeNavigationSlice.actions;
export default mapExcludeNavigationSlice.reducer;
