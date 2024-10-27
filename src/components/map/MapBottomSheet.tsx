import { StyleSheet, View } from "react-native";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

import BottomSheetComponent from "../common/BottomSheet";
import Button from "../common/Button";
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
                        <Button icon="directions" size="lg" onPress={gasStation.onPress} style={styles.button} />
                    )}
                </View>

                {data?.map((item, i) => (
                    <View key={i} style={styles.itemContainer}>
                        <Text type="secondary">{item.label}:</Text>
                        <Text type="dark" style={styles.textValue}>
                            {item.value}
                        </Text>
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
    titleContainer: {
        flexDirection: "row",
    },
    title: {
        textAlign: "center",
        marginVertical: SIZES.spacing.md,
        alignSelf: "center",
        flex: 1,
    },
    button: {
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
