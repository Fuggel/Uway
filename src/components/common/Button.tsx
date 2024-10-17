import { TouchableOpacity, ViewStyle } from "react-native";
import { IconButton } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

interface ButtonProps {
    icon: IconSource;
    onPress: () => void;
    type?: "primary" | "success" | "error" | "white";
    size?: "sm" | "md" | "lg" | "xl";
    style?: ViewStyle;
}

const Button = ({ icon, onPress, type, size, style }: ButtonProps) => {
    const getButtonSize = () => {
        switch (size) {
            case "sm":
                return SIZES.iconSize.sm;
            case "md":
                return SIZES.iconSize.md;
            case "lg":
                return SIZES.iconSize.lg;
            case "xl":
                return SIZES.iconSize.xl;
            default:
                return 24;
        }
    };

    const getButtonColor = () => {
        switch (type) {
            case "primary":
                return COLORS.primary;
            case "success":
                return COLORS.success;
            case "error":
                return COLORS.error;
            case "white":
                return COLORS.white;
            default:
                return COLORS.primary;
        }
    };

    return (
        <TouchableOpacity>
            <IconButton
                style={style}
                icon={icon}
                size={getButtonSize()}
                iconColor={getButtonColor()}
                onPress={onPress}
            />
        </TouchableOpacity>
    );
};

export default Button;
