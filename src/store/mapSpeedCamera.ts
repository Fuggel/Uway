import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { THRESHOLD } from "@/constants/env-constants";

import { RootState } from ".";

interface IMapSpeedCameraState {
    showSpeedCameras: boolean;
    playAcousticWarning: boolean;
    showWarningThresholdInMeters: number;
    playAcousticWarningThresholdInMeters: number;
}

const initialMapSpeedCameraState: IMapSpeedCameraState = {
    showSpeedCameras: false,
    playAcousticWarning: false,
    showWarningThresholdInMeters: THRESHOLD.SPEED_CAMERA.SHOW_WARNING_IN_METERS,
    playAcousticWarningThresholdInMeters: THRESHOLD.SPEED_CAMERA.PLAY_ACOUSTIC_WARNING_IN_METERS,
};

const mapSpeedCameraSlice = createSlice({
    name: "mapSpeedCamera",
    initialState: initialMapSpeedCameraState,
    reducers: {
        setShowSpeedCameras(state, action: PayloadAction<boolean>) {
            state.showSpeedCameras = action.payload;
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

export const mapSpeedCameraSelectors = {
    showSpeedCameras: (state: RootState) => state.mapSpeedCamera.showSpeedCameras,
    playAcousticWarning: (state: RootState) => state.mapSpeedCamera.playAcousticWarning,
    showWarningThresholdInMeters: (state: RootState) => state.mapSpeedCamera.showWarningThresholdInMeters,
    playAcousticWarningThresholdInMeters: (state: RootState) =>
        state.mapSpeedCamera.playAcousticWarningThresholdInMeters,
};

export const mapSpeedCameraActions = mapSpeedCameraSlice.actions;
export default mapSpeedCameraSlice.reducer;
