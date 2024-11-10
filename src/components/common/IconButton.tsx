import { TouchableOpacity, ViewStyle } from "react-native";
import { IconButton as RNPIconButton } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

interface IconButtonProps {
    icon: IconSource;
    onPress: () => void;
    type?: "primary" | "secondary" | "success" | "warning" | "error" | "white";
    size?: "sm" | "md" | "lg" | "xl" | "xxl";
    style?: ViewStyle;
}

const IconButton = ({ icon, onPress, type, size, style }: IconButtonProps) => {
    const getIconButtonSize = () => {
        switch (size) {
            case "sm":
                return SIZES.iconSize.sm;
            case "md":
                return SIZES.iconSize.md;
            case "lg":
                return SIZES.iconSize.lg;
            case "xl":
                return SIZES.iconSize.xl;
            case "xxl":
                return SIZES.iconSize.xxl;
            default:
                return 24;
        }
    };

    const getIconButtonColor = () => {
        switch (type) {
            case "primary":
                return COLORS.primary;
            case "secondary":
                return COLORS.secondary;
            case "success":
                return COLORS.success;
            case "warning":
                return COLORS.warning;
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
            <RNPIconButton
                style={{ margin: 0, ...style }}
                icon={icon}
                size={getIconButtonSize()}
                iconColor={getIconButtonColor()}
                onPress={onPress}
            />
        </TouchableOpacity>
    );
};

export default IconButton;
