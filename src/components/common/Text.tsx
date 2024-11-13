import { Text as RNText, TextStyle } from "react-native";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

interface TextProps {
    children: React.ReactNode;
    type?: "primary" | "secondary" | "gray" | "lightGray" | "white" | "success" | "error" | "warning";
    textStyle?: "header" | "body" | "caption" | "xs";
    style?: TextStyle;
}

const Text = ({ children, type, textStyle, style }: TextProps) => {
    const getTextStyle = (): TextStyle => {
        switch (textStyle) {
            case "header":
                return { fontWeight: "bold", fontSize: SIZES.fontSize.lg };
            case "body":
                return { fontSize: SIZES.fontSize.md };
            case "caption":
                return { fontSize: SIZES.fontSize.sm };
            case "xs":
                return { fontSize: SIZES.fontSize.xs };
            default:
                return { fontSize: SIZES.fontSize.md };
        }
    };

    const getTypeStyle = (): TextStyle => {
        switch (type) {
            case "primary":
                return { color: COLORS.primary };
            case "secondary":
                return { color: COLORS.secondary };
            case "gray":
                return { color: COLORS.gray };
            case "lightGray":
                return { color: COLORS.light_gray };
            case "white":
                return { color: COLORS.white };
            case "success":
                return { color: COLORS.success };
            case "warning":
                return { color: COLORS.warning };
            case "error":
                return { color: COLORS.error };
            default:
                return { color: COLORS.primary };
        }
    };

    return (
        <RNText
            style={{
                fontFamily: "Lato",
                lineHeight: SIZES.spacing.md,
                ...getTextStyle(),
                ...getTypeStyle(),
                ...style,
            }}
        >
            {children}
        </RNText>
    );
};

export default Text;
