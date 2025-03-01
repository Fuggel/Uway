import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { CurrentAnnotation, CurrentInstruction, Direction, RouteProfileType } from "@/types/INavigation";
import { LocationId, SearchFeatureCollection, SearchLocation } from "@/types/ISearch";

import { RootState } from ".";

interface IMapNavigationState {
    searchQuery: string;
    locationId: LocationId;
    location: SearchLocation | null;
    categoryLocation: SearchFeatureCollection | null;
    tracking: boolean;
    navigationView: boolean;
    isNavigationSelecting: boolean;
    isNavigationMode: boolean;
    navigationProfile: RouteProfileType;
    routeOptions: Direction[] | null;
    selectedRoute: number;
    directions: Direction | null;
    spokenInstruction: string | null;
    showRouteOptions: boolean;
    currentInstruction: CurrentInstruction | undefined;
    currentAnnotation: CurrentAnnotation | undefined;
    directNavigation: boolean;
}

const initialMapNavigationState: IMapNavigationState = {
    searchQuery: "",
    locationId: { default: "", mapbox_id: "" },
    location: null,
    categoryLocation: null,
    tracking: true,
    navigationView: false,
    isNavigationSelecting: false,
    isNavigationMode: false,
    navigationProfile: RouteProfileType.DRIVING,
    routeOptions: null,
    selectedRoute: 0,
    directions: null,
    spokenInstruction: null,
    showRouteOptions: false,
    currentInstruction: undefined,
    currentAnnotation: undefined,
    directNavigation: false,
};

const mapNavigationSlice = createSlice({
    name: "mapNavigation",
    initialState: initialMapNavigationState,
    reducers: {
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        },
        setLocationId(state, action: PayloadAction<LocationId>) {
            state.locationId = action.payload;
        },
        setLocation(state, action: PayloadAction<SearchLocation | null>) {
            state.location = action.payload;
        },
        setCategoryLocation(state, action: PayloadAction<SearchFeatureCollection | null>) {
            state.categoryLocation = action.payload;
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
        setRouteOptions(state, action: PayloadAction<Direction[] | null>) {
            state.routeOptions = action.payload;
        },
        setSelectedRoute(state, action: PayloadAction<number>) {
            state.selectedRoute = action.payload;
        },
        setDirections(state, action: PayloadAction<Direction | null>) {
            state.directions = action.payload;
        },
        setSpokenInstruction(state, action: PayloadAction<string | null>) {
            state.spokenInstruction = action.payload;
        },
        setShowRouteOptions(state, action: PayloadAction<boolean>) {
            state.showRouteOptions = action.payload;
        },
        setCurrentInstruction(state, action: PayloadAction<CurrentInstruction | undefined>) {
            state.currentInstruction = action.payload;
        },
        setCurrentAnnotation(state, action: PayloadAction<CurrentAnnotation | undefined>) {
            state.currentAnnotation = action.payload;
        },
        setDirectNavigation(state, action: PayloadAction<boolean>) {
            state.directNavigation = action.payload;
        },
        handleCancelNavigation(state) {
            state.directions = null;
            state.routeOptions = null;
            state.selectedRoute = 0;
            state.showRouteOptions = false;
            state.locationId = { default: "", mapbox_id: "" };
            state.spokenInstruction = null;
            state.location = null;
            state.navigationView = false;
            state.isNavigationSelecting = false;
            state.isNavigationMode = false;
            state.searchQuery = "";
            state.currentInstruction = undefined;
            state.currentAnnotation = undefined;
            state.directNavigation = false;
        },
    },
});

export const mapNavigationSelectors = {
    searchQuery: (state: RootState): string => state.mapNavigation.searchQuery,
    locationId: (state: RootState): LocationId => state.mapNavigation.locationId,
    location: (state: RootState): SearchLocation | null => state.mapNavigation.location,
    categoryLocation: (state: RootState): SearchFeatureCollection | null => state.mapNavigation.categoryLocation,
    tracking: (state: RootState): boolean => state.mapNavigation.tracking,
    navigationView: (state: RootState): boolean => state.mapNavigation.navigationView,
    isNavigationSelecting: (state: RootState): boolean => state.mapNavigation.isNavigationSelecting,
    isNavigationMode: (state: RootState): boolean => state.mapNavigation.isNavigationMode,
    navigationProfile: (state: RootState): RouteProfileType => state.mapNavigation.navigationProfile,
    routeOptions: (state: RootState): Direction[] | null => state.mapNavigation.routeOptions,
    selectedRoute: (state: RootState): number => state.mapNavigation.selectedRoute,
    directions: (state: RootState): Direction | null => state.mapNavigation.directions,
    spokenInstruction: (state: RootState): string | null => state.mapNavigation.spokenInstruction,
    showRouteOptions: (state: RootState): boolean => state.mapNavigation.showRouteOptions,
    currentInstruction: (state: RootState): CurrentInstruction | undefined => state.mapNavigation.currentInstruction,
    currentAnnotation: (state: RootState): CurrentAnnotation | undefined => state.mapNavigation.currentAnnotation,
    directNavigation: (state: RootState): boolean => state.mapNavigation.directNavigation,
};

export const mapNavigationActions = mapNavigationSlice.actions;
export default mapNavigationSlice.reducer;
