import Text from "@/components/common/Text";
import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import React from "react";
import { StyleSheet, View } from "react-native";

interface InfoRowProps {
    label: string;
    value: string | number | React.ReactNode;
}

const InfoRow = ({ label, value }: InfoRowProps) => {
    return (
        <View style={styles.row}>
            <Text type="gray">{label}:</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: SIZES.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light_gray,
        paddingBottom: SIZES.spacing.xs,
    },
    value: {
        fontWeight: "bold",
        maxWidth: "75%",
    },
});

export default InfoRow;
