import { StyleSheet } from "react-native";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

import { COLORS } from "@/constants/colors-constants";

import IconButton from "./IconButton";

interface LinkProps {
    to: () => void;
    icon?: IconSource;
}

const Link = ({ to, icon }: LinkProps) => {
    return <IconButton icon={icon || "chevron-right"} type="white" size="md" style={styles.iconButton} onPress={to} />;
};

export default Link;

const styles = StyleSheet.create({
    iconButton: {
        margin: 0,
        width: 30,
        height: 30,
        backgroundColor: COLORS.primary,
    },
});
