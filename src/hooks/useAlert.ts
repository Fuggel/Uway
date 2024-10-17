import { Audio } from "expo-av";
import { useEffect, useState } from "react";

const useAlert = (volume: number = 0.1) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const playSound = async () => {
        try {
            const { sound: soundObject } = await Audio.Sound.createAsync(require(`../assets/sounds/warning.mp3`), {
                volume,
            });

            setSound(soundObject);
            await soundObject.playAsync();
        } catch (error) {
            console.log(`Error loading or playing sound: ${error}`);
        }
    };

    const stopSound = async () => {
        if (sound) {
            try {
                await sound.stopAsync();
                await sound.unloadAsync();
                setSound(null);
            } catch (error) {
                console.log(`Error stopping or unloading sound: ${error}`);
            }
        }
    };

    useEffect(() => {
        return () => {
            stopSound();
        };
    }, []);

    return { playSound };
};

export default useAlert;
