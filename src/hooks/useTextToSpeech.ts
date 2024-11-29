import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { mapTextToSpeechSelectors } from "@/store/mapTextToSpeech";

const soundObject = new Audio.Sound();

const useTextToSpeech = () => {
    const allowTextToSpeech = useSelector(mapTextToSpeechSelectors.selectAllowTextToSpeech);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const startSpeech = async (speakText: string) => {
        if (!allowTextToSpeech || !speakText || isSpeaking) return;

        try {
            setIsSpeaking(true);

            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
            });

            if (!soundObject._loaded) {
                await soundObject.loadAsync(require("../assets/sounds/empty-sound.mp3"));
            }

            await soundObject?.playAsync();

            Speech.speak(speakText, {
                language: "de",
                onDone: () => setIsSpeaking(false),
                onStopped: () => setIsSpeaking(false),
                onError: () => setIsSpeaking(false),
            });
        } catch (error) {
            console.error(`Error during text-to-speech: ${error}`);
            setIsSpeaking(false);
        }
    };

    const stopSpeech = () => {
        Speech.stop();
        setIsSpeaking(false);
    };

    useEffect(() => {
        return () => {
            soundObject?.unloadAsync();
            Speech.stop();
        };
    }, []);

    return { startSpeech, stopSpeech };
};

export default useTextToSpeech;
