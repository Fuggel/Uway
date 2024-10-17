import * as Speech from "expo-speech";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { mapTextToSpeechSelectors } from "@/store/mapTextToSpeech";

const useTextToSpeech = () => {
    const allowTextToSpeech = useSelector(mapTextToSpeechSelectors.selectAllowTextToSpeech);

    const startSpeech = (speakText: string) => {
        if (!allowTextToSpeech || !speakText) return;
        Speech.speak(speakText, { language: "de" });
    };

    useEffect(() => {
        return () => {
            Speech.stop();
        };
    }, []);

    return { startSpeech };
};

export default useTextToSpeech;
