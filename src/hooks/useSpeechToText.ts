import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { LogBox, Platform } from "react-native";

import Voice from "@react-native-voice/voice";

LogBox.ignoreLogs([`new NativeEventEmitter()`]);

const SOUND_FILES = {
    mic_on: require("../assets/sounds/microphone-on.mp3"),
    mic_off: require("../assets/sounds/microphone-off.mp3"),
};

const useSpeechToText = () => {
    const isStopping = useRef(false);
    const [text, setText] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const silenceTimeout = useRef<NodeJS.Timeout | null>(null);

    const playSound = async (key: keyof typeof SOUND_FILES) => {
        if (Platform.OS !== "ios") return;

        try {
            const { sound } = await Audio.Sound.createAsync(SOUND_FILES[key]);
            await sound.playAsync();
            sound.setOnPlaybackStatusUpdate((status) => {
                if (!status.isLoaded) {
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.log(`Error loading or playing sound: ${error}`);
        }
    };

    const startListening = async () => {
        try {
            setText(null);
            await playSound("mic_on");
            await Voice.start("de-DE");
            setIsListening(true);
            isStopping.current = false;
        } catch (error) {
            console.log(`Failed to start voice recognition: ${error}`);
        }
    };

    const stopListening = async () => {
        if (isStopping.current) return;
        isStopping.current = true;

        try {
            playSound("mic_off");
            await Voice.stop();
            setIsListening(false);
            clearTimeout(silenceTimeout.current!);
        } catch (error) {
            console.log(`Failed to stop voice recognition: ${error}`);
        }
    };

    useEffect(() => {
        Voice.onSpeechResults = (event) => {
            if (event.value) {
                setText(event.value[0]);

                if (silenceTimeout.current) clearTimeout(silenceTimeout.current);

                silenceTimeout.current = setTimeout(() => {
                    stopListening();
                }, 2000);
            }
        };

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
            if (silenceTimeout.current) clearTimeout(silenceTimeout.current);
        };
    }, []);

    return { text, isListening, startListening, stopListening };
};

export default useSpeechToText;
