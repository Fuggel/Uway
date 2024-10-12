import { StyleSheet, View } from "react-native";

import Text from "../common/Text";

interface PriceDisplayProps {
    price: number;
}

const PriceDisplay = ({ price }: PriceDisplayProps) => {
    const [euros, cents] = price.toString().split(".");
    const mainCents = cents.slice(0, 2);
    const smallCents = cents.slice(2, 3);

    return (
        <View style={styles.priceContainer}>
            <Text type="dark" style={styles.price}>
                {euros},{mainCents}
            </Text>
            <Text type="dark" textStyle="xs" style={styles.superscript}>
                {smallCents}
            </Text>
            <Text type="dark" style={styles.price}>
                {" "}
                €
            </Text>
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
        fontWeight: "bold",
    },
    superscript: {
        fontWeight: "bold",
        position: "absolute",
        top: -5,
        right: 12,
    },
});

export default PriceDisplay;
