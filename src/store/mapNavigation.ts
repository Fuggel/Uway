import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { RouteProfileType } from "@/types/INavigation";

import { RootState } from ".";

interface IMapNavigationState {
    searchQuery: string;
    locationId: string;
    tracking: boolean;
    navigationView: boolean;
    isNavigationMode: boolean;
    navigationProfile: RouteProfileType;
}

const initialMapNavigationState: IMapNavigationState = {
    searchQuery: "",
    locationId: "",
    tracking: true,
    navigationView: false,
    isNavigationMode: false,
    navigationProfile: RouteProfileType.DRIVING,
};

const mapNavigationSlice = createSlice({
    name: "mapNavigation",
    initialState: initialMapNavigationState,
    reducers: {
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        },
        setLocationId(state, action: PayloadAction<string>) {
            state.locationId = action.payload;
        },
        setTracking(state, action: PayloadAction<boolean>) {
            state.tracking = action.payload;
        },
        setNavigationView(state, action: PayloadAction<boolean>) {
            state.navigationView = action.payload;
        },
        setIsNavigationMode(state, action: PayloadAction<boolean>) {
            state.isNavigationMode = action.payload;
        },
        setNavigationProfile(state, action: PayloadAction<RouteProfileType>) {
            state.navigationProfile = action.payload;
        },
    },
});

export const mapNavigationSelectors = {
    searchQuery: (state: RootState): string => state.mapNavigation.searchQuery,
    locationId: (state: RootState): string => state.mapNavigation.locationId,
    tracking: (state: RootState): boolean => state.mapNavigation.tracking,
    navigationView: (state: RootState): boolean => state.mapNavigation.navigationView,
    isNavigationMode: (state: RootState): boolean => state.mapNavigation.isNavigationMode,
    navigationProfile: (state: RootState): RouteProfileType => state.mapNavigation.navigationProfile,
};

export const mapNavigationActions = mapNavigationSlice.actions;
export default mapNavigationSlice.reducer;
