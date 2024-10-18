import { Switch as RNPSwitch } from "react-native-paper";

import { COLORS } from "@/constants/colors-constants";

interface SwitchProps {
    checked: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
}

const Switch = ({ checked, onChange, disabled }: SwitchProps) => {
    return (
        <RNPSwitch
            value={checked}
            thumbColor={checked ? COLORS.white : COLORS.white}
            trackColor={{ false: disabled ? COLORS.ultra_light_gray : COLORS.gray, true: COLORS.primary }}
            disabled={disabled}
            onValueChange={onChange}
        />
    );
};

export default Switch;
