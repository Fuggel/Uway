import { useEffect, useRef, useState } from "react";
import { LogBox } from "react-native";

import Voice from "@react-native-voice/voice";

LogBox.ignoreLogs([`new NativeEventEmitter()`]);

const useSpeechToText = () => {
    const [text, setText] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const silenceTimeout = useRef<NodeJS.Timeout | null>(null);

    const startListening = async () => {
        try {
            setText(null);
            await Voice.start("de-DE");
            setIsListening(true);
        } catch (error) {
            console.log(`Failed to start voice recognition: ${error}`);
        }
    };

    const stopListening = async () => {
        try {
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
