import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { COLORS } from "../../constants/colors-constants";
import { SIZES } from "../../constants/size-constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

interface LoadingProps {
    color?: string;
    size?: number;
    style?: StyleSheet;
}

export default function Loading({ color, size, style }: LoadingProps) {
    return (
        <ActivityIndicator
            animating={true}
            color={color ?? COLORS.secondary}
            size={size ?? SIZES.iconSize.xl}
            style={{ ...styles.loading, ...style }}
        />
    );
}

const styles = StyleSheet.create({
    loading: {
        position: "absolute",
        top: hp("45%"),
        left: wp("45%"),
        zIndex: 999999,
    },
});