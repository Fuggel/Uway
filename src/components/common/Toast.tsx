import { useEffect, useState } from "react";
import { Image, ImageProps, StyleSheet, View, ViewStyle } from "react-native";
import { Divider, Icon } from "react-native-paper";
import { useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { mapViewSelectors } from "@/store/mapView";
import { determineTheme, dynamicThemeStyles } from "@/utils/theme-utils";

import Text from "./Text";

interface ToastProps {
    show: boolean;
    type: "success" | "error" | "warning" | "info";
    title?: string;
    subTitle?: string;
    image?: ImageProps;
    children?: React.ReactNode;
    autoHide?: boolean;
    duration?: number;
    st?: ViewStyle;
}

const Toast = ({ show, type, title, subTitle, image, children, autoHide, duration = 3000, st }: ToastProps) => {
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

    const getColor = () => {
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
            {title && (
                <View style={styles.header}>
                    {!image ? (
                        <Icon source={getIcon()} color={getColor()} size={SIZES.iconSize.lg} />
                    ) : (
                        <Image
                            resizeMode="contain"
                            source={image}
                            style={{ width: SIZES.iconSize.lg, height: SIZES.iconSize.lg }}
                        />
                    )}

                    <Text style={{ fontWeight: "bold", color: getColor(), textAlign: "center" }}>{title}</Text>
                    {subTitle && <Text style={{ color: getColor(), textAlign: "center" }}>{subTitle}</Text>}
                </View>
            )}

            {title && children && <Divider style={styles.divider} />}
            {children && <View>{children}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white_transparent,
        padding: SIZES.spacing.sm,
        borderRadius: SIZES.borderRadius.sm,
    },
    header: {
        alignItems: "center",
        gap: SIZES.spacing.xs,
    },
    divider: {
        marginVertical: SIZES.spacing.xs,
    },
});

export default Toast;
