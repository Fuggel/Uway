import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

interface IMapIncidentState {
    showIncident: boolean;
}

const initialMapIncidentState: IMapIncidentState = {
    showIncident: true,
};

const mapIncidentSlice = createSlice({
    name: "mapIncident",
    initialState: initialMapIncidentState,
    reducers: {
        setShowIncident(state, action: PayloadAction<boolean>) {
            state.showIncident = action.payload;
        },
    },
});

export const mapIncidentSelectors = {
    showIncident: (state: RootState) => state.mapIncident.showIncident,
};

export const mapIncidentActions = mapIncidentSlice.actions;
export default mapIncidentSlice.reducer;