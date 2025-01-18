import { useRouter } from "expo-router";
import { Keyboard, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { SIZES } from "@/constants/size-constants";

import Link from "@/components/common/Link";
import MapSearch from "@/components/map/MapSearch/MapSearch";

const SearchModal = () => {
    const router = useRouter();

    return (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            <TouchableOpacity style={styles.container} activeOpacity={1} onPress={Keyboard.dismiss}>
                {Platform.OS === "android" && (
                    <View style={styles.closeButton}>
                        <Link icon="close" to={() => router.back()} />
                    </View>
                )}
                <MapSearch onClose={() => router.back()} />
            </TouchableOpacity>
        </Animated.View>
    );
};

export default SearchModal;

const styles = StyleSheet.create({
    container: {
        marginTop: SIZES.spacing.xl,
        height: "100%",
    },
    closeButton: {
        marginTop: SIZES.spacing.xs,
        marginBottom: SIZES.spacing.md,
        alignSelf: "flex-end",
        paddingHorizontal: SIZES.spacing.xs,
    },
});
