import { Image, ImageProps, StyleSheet, View } from "react-native";
import { Divider, Icon } from "react-native-paper";
import { useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { mapViewSelectors } from "@/store/mapView";
import { determineTheme, dynamicThemeStyles } from "@/utils/theme-utils";

import Text from "./Text";

interface ToastProps {
    show: boolean;
    type: "error" | "warning" | "info";
    title?: string;
    image?: ImageProps;
    children?: React.ReactNode;
}

const Toast = ({ show, type, title, image, children }: ToastProps) => {
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);

    const getIcon = () => {
        switch (type) {
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

    if (!show) return null;

    return (
        <View style={{ ...dynamicThemeStyles(styles.container, determineTheme(mapStyle)) }}>
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

                    <Text style={{ fontWeight: "bold", color: getColor() }}>{title}</Text>
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
        flexDirection: "row",
        alignItems: "center",
        gap: SIZES.spacing.sm,
        marginHorizontal: "auto",
    },
    divider: {
        marginVertical: SIZES.spacing.xs,
    },
});

export default Toast;
