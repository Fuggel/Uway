import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

import BottomSheetComponent from "../common/BottomSheet";

interface MapBottomSheetProps {
    title: string;
    data: { label: string; value: string | number | React.ReactNode }[] | null;
    onClose: () => void;
}

const MapBottomSheet = ({ title, data, onClose }: MapBottomSheetProps) => {
    return (
        <BottomSheetComponent onClose={onClose}>
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>

                {data &&
                    data.length > 0 &&
                    data.map((item, i) => (
                        <View key={i} style={styles.itemContainer}>
                            <Text style={styles.label}>{item.label}:</Text>
                            {typeof item.value === "string" || typeof item.value === "number" ? (
                                <Text style={styles.textValue}>{item.value}</Text>
                            ) : (
                                item.value
                            )}
                        </View>
                    ))}
            </View>
        </BottomSheetComponent>
    );
};

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
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: SIZES.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light_gray,
        paddingBottom: SIZES.spacing.xs,
    },
    label: {
        fontSize: SIZES.fontSize.md,
        color: COLORS.gray,
    },
    textValue: {
        fontSize: SIZES.fontSize.md,
        color: COLORS.dark,
        fontWeight: "bold",
        maxWidth: "75%",
    },
});

export default MapBottomSheet;
