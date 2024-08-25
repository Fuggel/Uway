import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RouteProfileType } from "../types/IMap";
import { RootState } from ".";

interface IMapNavigationState {
    searchQuery: string;
    locationId: string;
    navigationView: boolean;
    isNavigationMode: boolean;
    navigationProfile: RouteProfileType;
}

const initialMapNavigationState: IMapNavigationState = {
    searchQuery: "",
    locationId: "",
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
    navigationView: (state: RootState): boolean => state.mapNavigation.navigationView,
    isNavigationMode: (state: RootState): boolean => state.mapNavigation.isNavigationMode,
    navigationProfile: (state: RootState): RouteProfileType => state.mapNavigation.navigationProfile,
};

export const mapNavigationActions = mapNavigationSlice.actions;
export default mapNavigationSlice.reducer;
