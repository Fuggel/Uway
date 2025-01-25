import { StyleSheet, Text, View } from "react-native";
import { Dropdown as DropdownContainer } from "react-native-element-dropdown";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { DefaultFilter } from "@/types/IGasStation";
import { DropdownItem } from "@/types/ISettings";

import { COLORS } from "../../constants/colors-constants";
import { SIZES } from "../../constants/size-constants";

interface DropdownProps<T> {
    data: DropdownItem[];
    value: string;
    icon: string;
    placeholder?: string;
    clearable?: boolean;
    onChange: (value: string) => void;
}

export default function Dropdown<T>({ data, value, icon, placeholder, clearable, onChange }: DropdownProps<T>) {
    const renderItem = (item: DropdownItem) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemLabel}>{item.label}</Text>
        </View>
    );

    return (
        <DropdownContainer
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            search
            labelField="label"
            valueField="value"
            placeholder={placeholder || "Auswählen..."}
            searchPlaceholder="Suchen..."
            value={value}
            onChange={(item) => onChange(item.value)}
            renderLeftIcon={() => (
                <MaterialCommunityIcons name={icon as any} style={styles.iconRight} size={SIZES.iconSize.sm} />
            )}
            renderRightIcon={() => (
                <MaterialCommunityIcons
                    onPress={clearable ? () => onChange(DefaultFilter.ALL) : undefined}
                    name={clearable ? (value === DefaultFilter.ALL ? "chevron-down" : "close") : "chevron-down"}
                    style={styles.iconLeft}
                    size={SIZES.iconSize.sm}
                />
            )}
            renderItem={renderItem}
        />
    );
}

const styles = StyleSheet.create({
    dropdown: {
        height: SIZES.spacing.xxl,
        borderColor: COLORS.gray,
        borderRadius: SIZES.borderRadius.sm,
        paddingHorizontal: SIZES.spacing.sm,
        borderWidth: 1.5,
        flex: 1,
    },
    iconRight: {
        marginRight: SIZES.spacing.sm,
        color: COLORS.primary,
    },
    iconLeft: {
        color: COLORS.primary,
    },
    placeholderStyle: {
        fontSize: SIZES.fontSize.md,
    },
    selectedTextStyle: {
        fontSize: SIZES.fontSize.md,
    },
    iconStyle: {
        width: SIZES.iconSize.sm,
        height: SIZES.iconSize.sm,
    },
    inputSearchStyle: {
        height: SIZES.spacing.xl,
        fontSize: SIZES.fontSize.md,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: SIZES.spacing.sm,
    },
    itemLabel: {
        fontSize: SIZES.fontSize.md,
        color: COLORS.primary,
        marginHorizontal: SIZES.spacing.sm,
    },
});
