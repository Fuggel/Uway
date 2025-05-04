import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import Toast, { BaseToast } from "react-native-toast-message";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

const deviceHeight = Dimensions.get("window").height;

const ToastComponent = () => {
    return (
        <Toast
            position="top"
            visibilityTime={3000}
            autoHide={true}
            topOffset={deviceHeight > 1000 ? 50 : 60}
            swipeable
            config={{
                error: (props) => (
                    <BaseToast
                        {...props}
                        style={styles.error}
                        renderLeadingIcon={() => (
                            <MaterialCommunityIcons name="alert-circle-outline" style={styles.errorIcon} />
                        )}
                        text1Style={styles.text1}
                        text2Style={styles.text2}
                        text2Props={{
                            numberOfLines: 3,
                        }}
                    />
                ),
            }}
        />
    );
};

const styles = StyleSheet.create({
    error: {
        backgroundColor: COLORS.shadow_error,
        borderLeftWidth: 3,
        borderWidth: 3,
        borderColor: COLORS.error,
        maxWidth: "80%",
        alignItems: "center",
        minHeight: 75,
        height: "auto",
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    errorIcon: {
        color: COLORS.white,
        fontSize: SIZES.iconSize.lg,
        marginLeft: SIZES.spacing.sm,
        marginRight: -SIZES.spacing.sm,
    },
    text1: {
        fontSize: SIZES.fontSize.lg,
        color: COLORS.white,
    },
    text2: {
        fontSize: SIZES.fontSize.md,
        color: COLORS.white,
    },
});

export default ToastComponent;
