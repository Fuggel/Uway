import { COLORS } from "@/src/constants/colors-constants";
import { SIZES } from "@/src/constants/size-constants";
import { mapViewSelectors } from "@/src/store/mapView";
import { determineTheme, dynamicThemeStyles } from "@/src/utils/theme-utils";
import { Dimensions, Image, ImageProps, StyleSheet, Text, View } from "react-native";
import { Divider, Icon } from "react-native-paper";
import { useSelector } from "react-redux";

interface ToastProps {
    show: boolean;
    type: "error" | "warning" | "info";
    title?: string;
    image?: ImageProps;
    children?: React.ReactNode;
}

const deviceWidth = Dimensions.get("window").width;

export default function Toast({
    show,
    type,
    title,
    image,
    children,
}: ToastProps) {
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);

    const determineIcon = () => {
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

    const determineColor = () => {
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

    return (
        <>
            {show && (
                <View
                    style={{
                        ...dynamicThemeStyles(styles.container, determineTheme(mapStyle)),
                        width: !title ? "30%" : undefined,
                    }}
                >
                    {title && (
                        <View style={styles.header}>
                            {!image && <Icon source={determineIcon()} size={SIZES.iconSize.lg} color={determineColor()} />}
                            {image && <Image resizeMode="contain" source={image} style={{ width: SIZES.iconSize.lg, height: SIZES.iconSize.lg }} />}
                            <Text style={{ ...styles.title, color: determineColor() }}>{title}</Text>
                        </View>
                    )}

                    {title && children && (
                        <Divider style={styles.divider} />
                    )}

                    {children && (
                        <View style={styles.children}>
                            {children}
                        </View>
                    )}
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        left: SIZES.spacing.sm,
        bottom: SIZES.spacing.md,
        maxWidth: deviceWidth > 600 ? "35%" : "70%",
        marginTop: SIZES.spacing.sm,
        backgroundColor: COLORS.white_transparent,
        padding: SIZES.spacing.sm,
        borderRadius: SIZES.borderRadius.sm,
        zIndex: 999999,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: SIZES.spacing.sm,
        marginHorizontal: "auto",
    },
    title: {
        fontSize: SIZES.fontSize.md,
        fontWeight: "bold",
    },
    divider: {
        marginTop: SIZES.spacing.xs,
    },
    children: {
        marginHorizontal: "auto",
        marginVertical: SIZES.spacing.sm,
    }
});