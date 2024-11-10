import { useRouter } from "expo-router";
import { Keyboard, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { SIZES } from "@/constants/size-constants";

import Link from "@/components/common/Link";
import MapSearch from "@/components/map/MapSearch";

const Modal = () => {
    const router = useRouter();

    return (
        <Animated.View entering={FadeIn}>
            <TouchableOpacity style={styles.container} activeOpacity={1} onPress={Keyboard.dismiss}>
                <View style={styles.closeButton}>
                    <Link icon="close" to={() => router.back()} />
                </View>
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
    closeButton: {
        marginTop: SIZES.spacing.xs,
        marginBottom: SIZES.spacing.md,
        alignSelf: "flex-end",
        paddingHorizontal: SIZES.spacing.xs,
    },
});

export default Modal;
