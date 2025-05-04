import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Divider as RNPDivider } from "react-native-paper";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

interface DividerProps {
    st?: ViewStyle;
}

const Divider = (style: DividerProps) => {
    return <RNPDivider style={{ ...styles.container, ...style.st }} />;
};

export default Divider;

const styles = StyleSheet.create({
    container: {
        marginVertical: SIZES.spacing.lg,
        backgroundColor: COLORS.light_gray,
    },
});
