import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { mapTextToSpeechSelectors } from "@/store/mapTextToSpeech";

const useTextToSpeech = () => {
    const allowTextToSpeech = useSelector(mapTextToSpeechSelectors.selectAllowTextToSpeech);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [soundObject, setSoundObject] = useState<Audio.Sound | null>(null);

    const startSpeech = async (speakText: string) => {
        if (!allowTextToSpeech || !speakText) return;

        try {
            if (isSpeaking) {
                Speech.stop();
                setIsSpeaking(false);
            }

            setIsSpeaking(true);

            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
            });

            if (!soundObject) {
                const sound = new Audio.Sound();
                await sound.loadAsync(require("../assets/sounds/empty-sound.mp3"));
                setSoundObject(sound);
            }

            if (soundObject && !soundObject._loaded) {
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
    }, [soundObject]);

    return { startSpeech, stopSpeech };
};

export default useTextToSpeech;
