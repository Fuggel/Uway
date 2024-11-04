import { useEffect, useState } from "react";
import { Image, ImageProps, StyleSheet, View, ViewStyle } from "react-native";
import { Icon } from "react-native-paper";
import { useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { mapViewSelectors } from "@/store/mapView";
import { determineTheme, dynamicThemeStyles } from "@/utils/theme-utils";

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
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
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
        <View style={{ ...dynamicThemeStyles({ ...styles.container }, determineTheme(mapStyle)), ...st }}>
            <View style={styles.header}>
                {!image ? (
                    <Icon source={getIcon()} color={getIconColor()} size={SIZES.iconSize.xl} />
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
        backgroundColor: COLORS.white_transparent,
        padding: 20,
        borderRadius: SIZES.borderRadius.sm,
        alignSelf: "flex-start",
        minWidth: "30%",
    },
    header: {
        alignItems: "center",
        gap: SIZES.spacing.sm,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    image: {
        width: SIZES.iconSize.xl,
        height: SIZES.iconSize.xl,
    },
    title: {
        fontWeight: "bold",
        color: COLORS.dark,
    },
    subTitle: {
        color: COLORS.dark,
    },
});

export default Toast;
