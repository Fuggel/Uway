import { COLORS } from "@/src/constants/colors-constants";
import { SIZES } from "@/src/constants/size-constants";
import { StyleSheet, Text, View } from "react-native";
import { Divider, Icon } from "react-native-paper";

interface ToastProps {
    show: boolean;
    type: "error" | "warning" | "info";
    title?: string;
    children?: React.ReactNode;
}

export default function Toast({
    show,
    type,
    title,
    children,
}: ToastProps) {
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
                <View style={{ ...styles.container, width: !title ? "25%" : undefined }}>
                    {title && (
                        <View style={styles.header}>
                            <Icon source={determineIcon()} size={SIZES.iconSize.lg} color={determineColor()} />
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
        maxWidth: "60%",
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