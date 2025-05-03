import React from "react";
import { StyleSheet, View } from "react-native";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

import InfoRow from "@/components/common/InfoRow";
import Text from "@/components/common/Text";

interface IncidentInfoSheetProps {
    data: { label: string; value: string | number | React.ReactNode }[];
    title: string;
}

const IncidentInfoSheet = ({ data, title }: IncidentInfoSheetProps) => {
    return (
        <View style={styles.container}>
            <Text textStyle="header" style={styles.title}>
                {title}
            </Text>

            {data?.map((item, index) => <InfoRow key={index} label={item.label} value={item.value} />)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: SIZES.spacing.md,
        paddingBottom: SIZES.spacing.md,
    },
    title: {
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
    value: {
        fontWeight: "bold",
        maxWidth: "75%",
    },
});

export default IncidentInfoSheet;
