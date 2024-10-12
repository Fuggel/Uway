import { Switch as RNPSwitch } from "react-native-paper";

import { COLORS } from "@/constants/colors-constants";

interface SwitchProps {
    checked: boolean;
    onChange: (value: boolean) => void;
}

const Switch = ({ checked, onChange }: SwitchProps) => {
    return (
        <RNPSwitch
            value={checked}
            thumbColor={checked ? COLORS.white : COLORS.white}
            trackColor={{ false: COLORS.gray, true: COLORS.primary }}
            onValueChange={onChange}
        />
    );
};

export default Switch;
