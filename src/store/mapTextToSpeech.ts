import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { RootState } from ".";

interface IMapTextToSpeechState {
    allowTextToSpeech: boolean;
}

const initialMapTextToSpeechState: IMapTextToSpeechState = {
    allowTextToSpeech: true,
};

const mapTextToSpeechSlice = createSlice({
    name: "mapTextToSpeech",
    initialState: initialMapTextToSpeechState,
    reducers: {
        setAllowTextToSpeech: (state, paylod: PayloadAction<boolean>) => {
            state.allowTextToSpeech = paylod.payload;
        },
    },
});

export const mapTextToSpeechSelectors = {
    selectAllowTextToSpeech: (state: RootState) => state.mapTextToSpeech.allowTextToSpeech,
};

export const mapTextToSpeechActions = mapTextToSpeechSlice.actions;
export default mapTextToSpeechSlice.reducer;
