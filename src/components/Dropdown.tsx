import { StyleSheet } from "react-native";
import { Dropdown as DropdownContainer } from "react-native-element-dropdown";
import FeatherIcon from "@expo/vector-icons/Feather";
import { COLORS } from "../constants/colors-constants";
import { SIZES } from "../constants/size-constants";

interface DropdownProps {
    data: { label: string, value: string; }[];
    value: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
}

export default function Dropdown({ data, value, onChange }: DropdownProps) {
    return (
        <DropdownContainer
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select item"
            searchPlaceholder="Search..."
            value={value}
            onChange={item => onChange(item.value)}
            renderLeftIcon={() => (
                <FeatherIcon
                    name="map"
                    style={styles.icon}
                    color={COLORS.gray}
                    size={SIZES.iconSize.sm}
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    dropdown: {
        height: SIZES.spacing.xl,
        borderColor: COLORS.gray,
        borderWidth: 1.5,
        borderRadius: SIZES.borderRadius.sm,
        paddingHorizontal: SIZES.spacing.sm,
        flex: 1,
    },
    icon: {
        marginRight: SIZES.spacing.sm,
        color: COLORS.gray,
    },
    placeholderStyle: {
        fontSize: SIZES.fontSize.md,
    },
    selectedTextStyle: {
        fontSize: SIZES.fontSize.md,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: SIZES.spacing.xl,
        fontSize: SIZES.fontSize.md,
    },
});