import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { THRESHOLD } from "@/constants/env-constants";

import { RootState } from ".";

interface IMapIncidentState {
    showIncident: boolean;
    playAcousticWarning: boolean;
    showWarningThresholdInMeters: number;
    playAcousticWarningThresholdInMeters: number;
}

const initialMapIncidentState: IMapIncidentState = {
    showIncident: true,
    playAcousticWarning: false,
    showWarningThresholdInMeters: THRESHOLD.INCIDENT.SHOW_WARNING_IN_METERS,
    playAcousticWarningThresholdInMeters: THRESHOLD.INCIDENT.PLAY_ACOUSTIC_WARNING_IN_METERS,
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

        setShowWarningThresholdInMeters(state, action: PayloadAction<number>) {
            state.showWarningThresholdInMeters = action.payload;
        },
        setPlayAcousticWarningThresholdInMeters(state, action: PayloadAction<number>) {
            state.playAcousticWarningThresholdInMeters = action.payload;
        },
    },
});

export const mapIncidentSelectors = {
    showIncident: (state: RootState) => state.mapIncident.showIncident,
    playAcousticWarning: (state: RootState) => state.mapIncident.playAcousticWarning,
    showWarningThresholdInMeters: (state: RootState) => state.mapIncident.showWarningThresholdInMeters,
    playAcousticWarningThresholdInMeters: (state: RootState) => state.mapIncident.playAcousticWarningThresholdInMeters,
};

export const mapIncidentActions = mapIncidentSlice.actions;
export default mapIncidentSlice.reducer;
