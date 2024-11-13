import React from "react";
import { StyleSheet, View } from "react-native";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

import IconButton from "../common/IconButton";
import Text from "../common/Text";

interface MapBottomSheetProps {
    title: string;
    data: { label: string; value: string | number | React.ReactNode }[] | null;
    gasStation?: {
        show: boolean;
        onPress: () => void;
    };
}

const MapMarkerInfo = ({ title, data, gasStation }: MapBottomSheetProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text textStyle="header" style={styles.title}>
                    {title}
                </Text>
                {gasStation?.show && (
                    <View style={styles.iconButtonRight}>
                        <IconButton icon="directions" size="lg" type="secondary" onPress={gasStation.onPress} />
                    </View>
                )}
            </View>

            {data?.map((item, i) => (
                <View key={i} style={styles.itemContainer}>
                    <Text type="gray">{item.label}:</Text>
                    <Text style={styles.textValue}>{item.value}</Text>
                </View>
            ))}
        </View>
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
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    title: {
        textAlign: "center",
        marginVertical: SIZES.spacing.md,
        alignSelf: "center",
        flex: 1,
    },
    iconButtonRight: {
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

export default MapMarkerInfo;
