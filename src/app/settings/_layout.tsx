import { Stack, useRouter } from "expo-router";
import { Platform } from "react-native";
import { Button } from "react-native";

const SettingsLayout = () => {
    const router = useRouter();

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Einstellungen",
                    headerLeft: Platform.OS === "ios" ? () => (
                        <Button title="Map" onPress={() => router.back()} />
                    ) : undefined,
                }}
            />
            <Stack.Screen name="speed-camera/index" options={{ title: "Blitzer" }} />
            <Stack.Screen name="incidents/index" options={{ title: "Verkehrsdaten" }} />
        </Stack>
    );
};

export default SettingsLayout;
