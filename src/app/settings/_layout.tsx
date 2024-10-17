import { Stack, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

const SettingsLayout = () => {
    const router = useRouter();

    return (
        <>
            <View style={styles.closeButton}>
                <IconButton
                    icon="close-circle"
                    size={SIZES.iconSize.lg}
                    iconColor={COLORS.primary}
                    onPress={() => router.push("/")}
                />
            </View>

            <Stack>
                <Stack.Screen name="index" options={{ title: "Einstellungen" }} />
                <Stack.Screen name="speed-camera/index" options={{ title: "Blitzer-Einstellungen" }} />
                <Stack.Screen name="incidents/index" options={{ title: "Verkehrsdaten-Einstellungen" }} />
            </Stack>
        </>
    );
};

const styles = StyleSheet.create({
    closeButton: {
        position: "absolute",
        top: SIZES.spacing.md,
        right: 0,
        zIndex: 999999,
    },
});

export default SettingsLayout;
