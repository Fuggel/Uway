import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { RootState } from ".";

interface IMapSpeedCameraState {
    showSpeedCameras: boolean;
    playAcousticWarning: boolean;
}

const initialMapSpeedCameraState: IMapSpeedCameraState = {
    showSpeedCameras: false,
    playAcousticWarning: false,
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
    },
});

export const mapSpeedCameraSelectors = {
    showSpeedCameras: (state: RootState) => state.mapSpeedCamera.showSpeedCameras,
    playAcousticWarning: (state: RootState) => state.mapSpeedCamera.playAcousticWarning,
};

export const mapSpeedCameraActions = mapSpeedCameraSlice.actions;
export default mapSpeedCameraSlice.reducer;
