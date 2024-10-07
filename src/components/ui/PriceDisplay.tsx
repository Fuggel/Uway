import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

interface PriceDisplayProps {
    price: number;
}

const PriceDisplay = ({ price }: PriceDisplayProps) => {
    const [euros, cents] = price.toString().split(".");
    const mainCents = cents.slice(0, 2);
    const smallCents = cents.slice(2, 3);

    return (
        <View style={styles.priceContainer}>
            <Text style={styles.price}>
                {euros},{mainCents}
            </Text>
            <Text style={styles.superscript}>{smallCents}</Text>
            <Text style={styles.price}> €</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    priceContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 4,
    },
    price: {
        fontSize: SIZES.fontSize.md,
        fontWeight: "bold",
    },
    superscript: {
        fontSize: SIZES.fontSize.xs,
        fontWeight: "bold",
        color: COLORS.dark,
        position: "absolute",
        top: -5,
        right: 12,
    },
});

export default PriceDisplay;
