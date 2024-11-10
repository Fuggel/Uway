import { StyleSheet, View } from "react-native";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

import BottomSheetComponent from "../common/BottomSheet";
import IconButton from "../common/IconButton";
import Text from "../common/Text";

interface MapBottomSheetProps {
    title: string;
    data: { label: string; value: string | number | React.ReactNode }[] | null;
    onClose: () => void;
    gasStation?: {
        show: boolean;
        onPress: () => void;
    };
}

const MapBottomSheet = ({ title, data, onClose, gasStation }: MapBottomSheetProps) => {
    return (
        <BottomSheetComponent onClose={onClose}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text textStyle="header" style={styles.title}>
                        {title}
                    </Text>
                    {gasStation?.show && (
                        <IconButton
                            icon="directions"
                            size="lg"
                            onPress={gasStation.onPress}
                            style={styles.iconButton}
                        />
                    )}
                </View>

                {data?.map((item, i) => (
                    <View key={i} style={styles.itemContainer}>
                        <Text type="secondary">{item.label}:</Text>
                        <Text style={styles.textValue}>{item.value}</Text>
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
        paddingBottom: SIZES.spacing.md,
    },
    titleContainer: {
        flexDirection: "row",
    },
    title: {
        textAlign: "center",
        marginVertical: SIZES.spacing.md,
        alignSelf: "center",
        flex: 1,
    },
    iconButton: {
        position: "absolute",
        right: 0,
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
    textValue: {
        fontWeight: "bold",
        maxWidth: "75%",
    },
});

export default MapBottomSheet;
