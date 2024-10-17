import { Stack } from "expo-router";

const SettingsLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Einstellungen" }} />
            <Stack.Screen name="speed-camera/index" options={{ title: "Blitzer-Einstellungen" }} />
            <Stack.Screen name="incidents/index" options={{ title: "Verkehrsdaten-Einstellungen" }} />
        </Stack>
    );
};

export default SettingsLayout;
