import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { mapTextToSpeechSelectors } from "@/store/mapTextToSpeech";

const soundObject = new Audio.Sound();

const useTextToSpeech = () => {
    const allowTextToSpeech = useSelector(mapTextToSpeechSelectors.selectAllowTextToSpeech);

    const startSpeech = async (speakText: string) => {
        if (!allowTextToSpeech || !speakText) return;

        try {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
            });
            await soundObject.loadAsync(require("../assets/sounds/empty-sound.mp3"));
            await soundObject.playAsync();

            Speech.speak(speakText, { language: "de" });
        } catch (error) {
            console.log(`Error setting audio mode: ${error}`);
        }
    };

    useEffect(() => {
        return () => {
            Speech.stop();
        };
    }, []);

    return { startSpeech };
};

export default useTextToSpeech;
