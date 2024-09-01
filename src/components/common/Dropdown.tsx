import { Image, StyleSheet, Text, View } from "react-native";
import { Dropdown as DropdownContainer } from "react-native-element-dropdown";
import FeatherIcon from "@expo/vector-icons/Feather";
import { COLORS } from "../../constants/colors-constants";
import { SIZES } from "../../constants/size-constants";
import { DropdownItem } from "@/src/types/ISettings";

interface DropdownProps<T> {
    data: DropdownItem[];
    value: string;
    onChange: (value: T) => void;
}

export default function Dropdown<T>({ data, value, onChange }: DropdownProps<T>) {
    const renderItem = (item: DropdownItem) => (
        <View style={styles.itemContainer}>
            {item.img && <Image source={item.img} style={styles.img} />}
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
            placeholder="Select item"
            searchPlaceholder="Search..."
            value={value}
            onChange={item => onChange(item.value as T)}
            renderLeftIcon={() => (
                <FeatherIcon
                    name="map"
                    style={styles.icon}
                    color={COLORS.gray}
                    size={SIZES.iconSize.sm}
                />
            )}
            renderItem={renderItem}
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
    img: {
        width: 75,
        height: 75,
        marginLeft: SIZES.spacing.sm,
        borderRadius: SIZES.borderRadius.sm,
    },
    itemLabel: {
        fontSize: SIZES.fontSize.md,
        color: COLORS.dark,
        marginLeft: SIZES.spacing.sm,
    },
});