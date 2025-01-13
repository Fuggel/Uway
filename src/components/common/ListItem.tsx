import { StyleSheet, TouchableOpacity } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

import Text from "./Text";

interface ListItemProps {
    onPress: () => void;
    icon: string;
    text: string;
}

const ListItem = ({ onPress, icon, text }: ListItemProps) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <MaterialCommunityIcons name={icon as any} size={24} color={COLORS.primary} />
            <Text>{text}</Text>
        </TouchableOpacity>
    );
};

export default ListItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: SIZES.spacing.sm,
    },
});
