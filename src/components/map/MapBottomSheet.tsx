import { View, Text, StyleSheet } from "react-native";
import BottomSheetComponent from "../common/BottomSheet";
import { SIZES } from "@/src/constants/size-constants";
import { COLORS } from "@/src/constants/colors-constants";

interface MapBottomSheetProps {
    title: string;
    data: { label: string; value: string | number }[];
    onClose: () => void;
}

export default function MapBottomSheet({ title, data, onClose }: MapBottomSheetProps) {
    return (
        <BottomSheetComponent onClose={onClose}>
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>

                {data.map((item, i) => (
                    <View key={i} style={styles.itemContainer}>
                        <Text style={styles.label}>{item.label}:</Text>
                        <Text style={styles.value}>{item.value}</Text>
                    </View>
                ))}
            </View>
        </BottomSheetComponent>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: SIZES.spacing.md,
    },
    title: {
        fontSize: SIZES.fontSize.lg,
        fontWeight: "bold",
        color: COLORS.primary,
        textAlign: "center",
        marginVertical: SIZES.spacing.md,
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: SIZES.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light_gray,
        paddingBottom: SIZES.spacing.xs,
    },
    label: {
        fontSize: SIZES.fontSize.md,
        color: COLORS.gray,
    },
    value: {
        fontSize: SIZES.fontSize.md,
        color: COLORS.dark,
        fontWeight: "bold",
    },
});
