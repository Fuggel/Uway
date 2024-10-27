import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { SearchLocation } from "@/types/ISearch";

import { RootState } from ".";

interface IMapSearchState {
    recentSearches: SearchLocation[];
}

const initialMapSearchState: IMapSearchState = {
    recentSearches: [],
};

const mapSearchSlice = createSlice({
    name: "mapSearch",
    initialState: initialMapSearchState,
    reducers: {
        setRecentSearches: (state, action: PayloadAction<SearchLocation[]>) => {
            state.recentSearches = action.payload;
        },
    },
});

export const mapSearchSelectors = {
    recentSearches: (state: RootState): SearchLocation[] => state.mapSearch.recentSearches,
};

export const mapSearchActions = mapSearchSlice.actions;
export default mapSearchSlice.reducer;
