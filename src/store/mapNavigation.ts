import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Direction, RouteProfileType } from "@/types/INavigation";
import { SearchLocation } from "@/types/ISearch";

import { RootState } from ".";

interface IMapNavigationState {
    searchQuery: string;
    locationId: string;
    location: SearchLocation | null;
    tracking: boolean;
    navigationView: boolean;
    isNavigationSelecting: boolean;
    isNavigationMode: boolean;
    navigationProfile: RouteProfileType;
    directions: Direction | null;
    spokenInstruction: string | null;
}

const initialMapNavigationState: IMapNavigationState = {
    searchQuery: "",
    locationId: "",
    location: null,
    tracking: true,
    navigationView: false,
    isNavigationSelecting: false,
    isNavigationMode: false,
    navigationProfile: RouteProfileType.DRIVING,
    directions: null,
    spokenInstruction: null,
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
        setLocation(state, action: PayloadAction<SearchLocation | null>) {
            state.location = action.payload;
        },
        setTracking(state, action: PayloadAction<boolean>) {
            state.tracking = action.payload;
        },
        setNavigationView(state, action: PayloadAction<boolean>) {
            state.navigationView = action.payload;
        },
        setIsNavigationSelecting(state, action: PayloadAction<boolean>) {
            state.isNavigationSelecting = action.payload;
        },
        setIsNavigationMode(state, action: PayloadAction<boolean>) {
            state.isNavigationMode = action.payload;
        },
        setNavigationProfile(state, action: PayloadAction<RouteProfileType>) {
            state.navigationProfile = action.payload;
        },
        setDirections(state, action: PayloadAction<Direction | null>) {
            state.directions = action.payload;
        },
        setSpokenInstruction(state, action: PayloadAction<string | null>) {
            state.spokenInstruction = action.payload;
        },
        handleCancelNavigation(state) {
            state.directions = null;
            state.searchQuery = "";
            state.locationId = "";
            state.spokenInstruction = null;
            state.location = null;
            state.navigationView = false;
            state.isNavigationSelecting = false;
            state.isNavigationMode = false;
            state.searchQuery = "";
        },
    },
});

export const mapNavigationSelectors = {
    searchQuery: (state: RootState): string => state.mapNavigation.searchQuery,
    locationId: (state: RootState): string => state.mapNavigation.locationId,
    location: (state: RootState): SearchLocation | null => state.mapNavigation.location,
    tracking: (state: RootState): boolean => state.mapNavigation.tracking,
    navigationView: (state: RootState): boolean => state.mapNavigation.navigationView,
    isNavigationSelecting: (state: RootState): boolean => state.mapNavigation.isNavigationSelecting,
    isNavigationMode: (state: RootState): boolean => state.mapNavigation.isNavigationMode,
    navigationProfile: (state: RootState): RouteProfileType => state.mapNavigation.navigationProfile,
    directions: (state: RootState): Direction | null => state.mapNavigation.directions,
    spokenInstruction: (state: RootState): string | null => state.mapNavigation.spokenInstruction,
};

export const mapNavigationActions = mapNavigationSlice.actions;
export default mapNavigationSlice.reducer;
