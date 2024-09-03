import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { Route } from "../types/IMock";

interface IMapTestingState {
    simulateRoute: boolean;
    selectedRoute: string;
}

const initialMapTestingState: IMapTestingState = {
    simulateRoute: false,
    selectedRoute: Route.OTTENSER_MARKTPLATZ_TO_WILLY_BRANDT_STRASSE,
};

const mapTestingSlice = createSlice({
    name: "mapTesting",
    initialState: initialMapTestingState,
    reducers: {
        setSimulateRoute(state, action: PayloadAction<boolean>) {
            state.simulateRoute = action.payload;
        },
        setSelectedRoute(state, action: PayloadAction<string>) {
            state.selectedRoute = action.payload;
        },
    },
});

export const mapTestingSelectors = {
    simulateRoute: (state: RootState): boolean => state.mapTesting.simulateRoute,
    selectedRoute: (state: RootState): string => state.mapTesting.selectedRoute,
};

export const mapTestingActions = mapTestingSlice.actions;
export default mapTestingSlice.reducer;
