import { Dimensions, Image, ImageProps, StyleSheet, View } from "react-native";
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

const deviceWidth = Dimensions.get("window").width;

const Toast = ({ show, type, title, image, children }: ToastProps) => {
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

    const determineColor = (): "error" | "warning" | "primary" => {
        switch (type) {
            case "error":
                return "error";
            case "warning":
                return "warning";
            case "info":
                return "primary";
            default:
                return "primary";
        }
    };

    return (
        <>
            {show && (
                <View
                    style={{
                        ...dynamicThemeStyles(styles.container, determineTheme(mapStyle)),
                    }}
                >
                    {title && (
                        <View style={styles.header}>
                            {!image ? (
                                <Icon source={determineIcon()} size={SIZES.iconSize.lg} color={determineColor()} />
                            ) : (
                                <Image
                                    resizeMode="contain"
                                    source={image}
                                    style={{ width: SIZES.iconSize.lg, height: SIZES.iconSize.lg }}
                                />
                            )}

                            <Text style={{ fontWeight: "bold" }} type={determineColor()}>
                                {title}
                            </Text>
                        </View>
                    )}

                    {title && children && <Divider style={styles.divider} />}

                    {children && <View style={styles.children}>{children}</View>}
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        left: SIZES.spacing.sm,
        bottom: SIZES.spacing.md,
        alignSelf: "flex-start",
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
    divider: {
        marginTop: SIZES.spacing.xs,
    },
    children: {
        marginHorizontal: "auto",
        marginVertical: SIZES.spacing.sm,
    },
});

export default Toast;
