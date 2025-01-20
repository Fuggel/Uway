import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { SavedSearchLocation, SearchLocation } from "@/types/ISearch";

import { RootState } from ".";

interface IMapSearchState {
    recentSearches: SearchLocation[];
    saveSearch: SavedSearchLocation;
    savedSearches: SavedSearchLocation[];
    editingSearch: SavedSearchLocation | null;
    isEditingSavedSearch: boolean;
    isPoiSearch: boolean;
}

const initialMapSearchState: IMapSearchState = {
    recentSearches: [],
    saveSearch: {} as SavedSearchLocation,
    savedSearches: [],
    editingSearch: null,
    isEditingSavedSearch: false,
    isPoiSearch: false,
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
        startEditingSearch: (state, action: PayloadAction<SavedSearchLocation | null>) => {
            state.editingSearch = action.payload;
            state.isEditingSavedSearch = !!action.payload;
        },
        updateSavedSearch: (state, action: PayloadAction<SavedSearchLocation>) => {
            const index = state.savedSearches.findIndex((search) => search.title === action.payload.title);

            if (index !== -1) {
                state.savedSearches[index] = action.payload;
            }
        },
        setIsPoiSearch: (state, action: PayloadAction<boolean>) => {
            state.isPoiSearch = action.payload;
        },
        deleteRecentSearch: (state, action: PayloadAction<string>) => {
            state.recentSearches = state.recentSearches.filter((search) => search.default_id !== action.payload);
        },
        deleteSavedSearch: (state, action: PayloadAction<string>) => {
            state.savedSearches = state.savedSearches.filter((search) => search.title !== action.payload);
        },
    },
});

export const mapSearchSelectors = {
    recentSearches: (state: RootState): SearchLocation[] => state.mapSearch.recentSearches,
    saveSearch: (state: RootState): SavedSearchLocation => state.mapSearch.saveSearch,
    savedSearches: (state: RootState): SavedSearchLocation[] => state.mapSearch.savedSearches,
    startEditingSearch: (state: RootState): SavedSearchLocation | null => state.mapSearch.editingSearch,
    isEditingSavedSearch: (state: RootState): boolean => state.mapSearch.isEditingSavedSearch,
    isPoiSearch: (state: RootState): boolean => state.mapSearch.isPoiSearch,
};

export const mapSearchActions = mapSearchSlice.actions;
export default mapSearchSlice.reducer;
