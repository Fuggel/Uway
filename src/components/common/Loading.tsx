import { StyleSheet, ViewStyle } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

interface LoadingProps {
    color?: string;
    size?: number;
    style?: ViewStyle;
}

const Loading = ({ color, size, style }: LoadingProps) => {
    return (
        <ActivityIndicator
            animating={true}
            color={color ?? COLORS.secondary}
            size={size ?? SIZES.iconSize.xl}
            style={{ ...styles.loading, ...style }}
        />
    );
};

const styles = StyleSheet.create({
    loading: {
        position: "absolute",
        top: "50%",
        left: "50%",
        zIndex: 999999,
    },
});

export default Loading;
