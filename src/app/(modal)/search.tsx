import { useRouter } from "expo-router";
import { Keyboard, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { SIZES } from "@/constants/size-constants";

import MapSearch from "@/components/map/MapSearch";

const Modal = () => {
    const router = useRouter();

    return (
        <Animated.View entering={FadeIn}>
            <TouchableOpacity style={styles.container} activeOpacity={1} onPress={Keyboard.dismiss}>
                <MapSearch onClose={() => router.back()} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: SIZES.spacing.xl,
        paddingHorizontal: SIZES.spacing.xs,
        height: "100%",
    },
});

export default Modal;
