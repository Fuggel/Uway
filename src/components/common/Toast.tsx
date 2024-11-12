import { useEffect, useState } from "react";
import { Image, ImageProps, StyleSheet, View, ViewStyle } from "react-native";
import { Icon } from "react-native-paper";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

import Text from "./Text";

interface ToastProps {
    show: boolean;
    type: "success" | "error" | "warning" | "info";
    title: string;
    subTitle?: string;
    image?: ImageProps;
    autoHide?: boolean;
    duration?: number;
    st?: ViewStyle;
}

const Toast = ({ show, type, title, subTitle, image, autoHide, duration = 3000, st }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            if (autoHide) {
                const timer = setTimeout(() => {
                    setIsVisible(false);
                }, duration);
                return () => clearTimeout(timer);
            }
        } else {
            setIsVisible(false);
        }
    }, [show, autoHide]);

    const getIcon = () => {
        switch (type) {
            case "success":
                return "check-circle";
            case "error":
                return "alert-circle";
            case "warning":
                return "alert";
            case "info":
                return "information";
            default:
                return "information";
        }
    };

    const getIconColor = () => {
        switch (type) {
            case "success":
                return COLORS.success;
            case "error":
                return COLORS.error;
            case "warning":
                return COLORS.warning;
            case "info":
                return COLORS.primary;
            default:
                return COLORS.primary;
        }
    };

    if (!show || !isVisible) return null;

    return (
        <View style={{ ...styles.container, ...st }}>
            <View style={styles.header}>
                {!image ? (
                    <Icon source={getIcon()} color={getIconColor()} size={SIZES.iconSize.lg} />
                ) : (
                    <Image resizeMode="contain" source={image} style={styles.image} />
                )}

                <View>
                    <Text style={styles.title}>{title}</Text>
                    {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primary,
        padding: 20,
        borderRadius: SIZES.borderRadius.md,
        alignSelf: "flex-start",
    },
    header: {
        alignItems: "center",
        gap: SIZES.spacing.sm,
        flexDirection: "row",
        width: "100%",
    },
    image: {
        width: SIZES.iconSize.xl,
        height: SIZES.iconSize.xl,
    },
    title: {
        fontWeight: "bold",
        color: COLORS.white,
    },
    subTitle: {
        color: COLORS.light_gray,
    },
});

export default Toast;
