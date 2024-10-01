import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

interface IMapSpeedCameraState {
    showSpeedCameras: boolean;
}

const initialMapSpeedCameraState: IMapSpeedCameraState = {
    showSpeedCameras: false,
};

const mapSpeedCameraSlice = createSlice({
    name: "mapSpeedCamera",
    initialState: initialMapSpeedCameraState,
    reducers: {
        setShowSpeedCameras(state, action: PayloadAction<boolean>) {
            state.showSpeedCameras = action.payload;
        },
    },
});

export const mapSpeedCameraSelectors = {
    showSpeedCameras: (state: RootState) => state.mapSpeedCamera.showSpeedCameras,
};

export const mapSpeedCameraActions = mapSpeedCameraSlice.actions;
export default mapSpeedCameraSlice.reducer;
