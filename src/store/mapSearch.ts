import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { SavedSearchLocation, SearchLocation } from "@/types/ISearch";

import { RootState } from ".";

interface IMapSearchState {
    recentSearches: SearchLocation[];
    saveSearch: SavedSearchLocation;
    savedSearches: SavedSearchLocation[];
}

const initialMapSearchState: IMapSearchState = {
    recentSearches: [],
    saveSearch: {} as SavedSearchLocation,
    savedSearches: [],
};

const mapSearchSlice = createSlice({
    name: "mapSearch",
    initialState: initialMapSearchState,
    reducers: {
        setRecentSearches: (state, action: PayloadAction<SearchLocation[]>) => {
            state.recentSearches = action.payload;
        },
        setSaveSearch: (state, action: PayloadAction<SavedSearchLocation>) => {
            state.saveSearch = action.payload;
        },
        setSavedSearches: (state, action: PayloadAction<SavedSearchLocation[]>) => {
            state.savedSearches = action.payload;
        },
        deleteRecentSearch: (state, action: PayloadAction<string>) => {
            state.recentSearches = state.recentSearches.filter((search) => search.default_id !== action.payload);
        },
    },
});

export const mapSearchSelectors = {
    recentSearches: (state: RootState): SearchLocation[] => state.mapSearch.recentSearches,
    saveSearch: (state: RootState): SavedSearchLocation => state.mapSearch.saveSearch,
    savedSearches: (state: RootState): SavedSearchLocation[] => state.mapSearch.savedSearches,
};

export const mapSearchActions = mapSearchSlice.actions;
export default mapSearchSlice.reducer;
