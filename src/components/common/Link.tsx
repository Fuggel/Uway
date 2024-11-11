import { StyleSheet, TextStyle } from "react-native";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

import { COLORS } from "@/constants/colors-constants";

import IconButton from "./IconButton";

interface LinkProps {
    to: () => void;
    icon?: IconSource;
    type?: "primary" | "secondary" | "gray" | "lightGray" | "white" | "success" | "error" | "warning";
}

const Link = ({ to, icon, type }: LinkProps) => {
    const getTypeStyle = (): TextStyle => {
        switch (type) {
            case "primary":
                return { backgroundColor: COLORS.primary };
            case "secondary":
                return { backgroundColor: COLORS.secondary };
            case "gray":
                return { backgroundColor: COLORS.gray };
            case "lightGray":
                return { backgroundColor: COLORS.light_gray };
            case "white":
                return { backgroundColor: COLORS.white };
            case "success":
                return { backgroundColor: COLORS.success };
            case "warning":
                return { backgroundColor: COLORS.warning };
            case "error":
                return { backgroundColor: COLORS.error };
            default:
                return { backgroundColor: COLORS.primary };
        }
    };

    return (
        <IconButton
            icon={icon || "chevron-right"}
            type="white"
            size="md"
            style={{ ...styles.iconButton, ...getTypeStyle() }}
            onPress={to}
        />
    );
};

export default Link;

const styles = StyleSheet.create({
    iconButton: {
        margin: 0,
        width: 30,
        height: 30,
    },
});
