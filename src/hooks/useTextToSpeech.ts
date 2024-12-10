import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { mapTextToSpeechSelectors } from "@/store/mapTextToSpeech";

const soundObject = new Audio.Sound();

const useTextToSpeech = () => {
    const allowTextToSpeech = useSelector(mapTextToSpeechSelectors.selectAllowTextToSpeech);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speechQueue, setSpeechQueue] = useState<string[]>([]);

    const processSpeechQueue = async () => {
        if (!allowTextToSpeech || isSpeaking || speechQueue.length === 0) return;

        const speakText = speechQueue[0];
        setIsSpeaking(true);

        try {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
            });

            if (!soundObject._loaded) {
                await soundObject.loadAsync(require("../assets/sounds/empty-sound.mp3"));
            }

            await soundObject?.playAsync();

            Speech.speak(speakText, {
                language: "de",
                onDone: () => {
                    setIsSpeaking(false);
                    setSpeechQueue((queue) => queue.slice(1));
                },
                onStopped: () => {
                    setIsSpeaking(false);
                    setSpeechQueue([]);
                },
                onError: () => {
                    setIsSpeaking(false);
                    setSpeechQueue((queue) => queue.slice(1));
                },
            });
        } catch (error) {
            console.log(`Error during text-to-speech: ${error}`);
            setIsSpeaking(false);
            setSpeechQueue((queue) => queue.slice(1));
        }
    };

    const startSpeech = (speakText: string) => {
        if (!allowTextToSpeech || !speakText) return;
        setSpeechQueue((queue) => [...queue, speakText]);
    };

    const stopSpeech = () => {
        Speech.stop();
        setIsSpeaking(false);
        setSpeechQueue([]);
    };

    useEffect(() => {
        if (!isSpeaking && speechQueue.length > 0) {
            processSpeechQueue();
        }
    }, [speechQueue]);

    useEffect(() => {
        return () => {
            soundObject?.unloadAsync();
            Speech.stop();
        };
    }, []);

    return { startSpeech, stopSpeech };
};

export default useTextToSpeech;
