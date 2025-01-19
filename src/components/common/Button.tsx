import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ButtonProps {
    icon: string;
    onPress?: () => void;
    st?: ViewStyle;
}

const Button = ({ icon, onPress, st }: ButtonProps) => {
    return (
        <TouchableOpacity activeOpacity={1} style={{ ...styles.button, ...st }} onPress={onPress}>
            <MaterialCommunityIcons name={icon as any} size={24} color="white" />
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    button: {
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        borderRadius: 15,
        marginRight: 10,
    },
});
