import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { RootState } from ".";

interface IMapIncidentState {
    showIncident: boolean;
    playAcousticWarning: boolean;
}

const initialMapIncidentState: IMapIncidentState = {
    showIncident: true,
    playAcousticWarning: false,
};

const mapIncidentSlice = createSlice({
    name: "mapIncident",
    initialState: initialMapIncidentState,
    reducers: {
        setShowIncident(state, action: PayloadAction<boolean>) {
            state.showIncident = action.payload;
        },
        setPlayAcousticWarning(state, action: PayloadAction<boolean>) {
            state.playAcousticWarning = action.payload;
        },
    },
});

export const mapIncidentSelectors = {
    showIncident: (state: RootState) => state.mapIncident.showIncident,
    playAcousticWarning: (state: RootState) => state.mapIncident.playAcousticWarning,
};

export const mapIncidentActions = mapIncidentSlice.actions;
export default mapIncidentSlice.reducer;
