import { StyleSheet, TextStyle, View } from "react-native";

import Text from "../common/Text";

interface PriceDisplayProps {
    price: number;
    st?: TextStyle;
    stSub?: TextStyle;
}

const PriceDisplay = ({ price, st, stSub }: PriceDisplayProps) => {
    const [euros, cents] = price.toString().split(".");
    const mainCents = cents.slice(0, 2);
    const smallCents = cents.slice(2, 3);

    return (
        <View style={styles.priceContainer}>
            <Text style={{ ...styles.price, ...st }}>
                {euros},{mainCents}
            </Text>
            <Text textStyle="xs" style={{ ...styles.superscript, ...stSub }}>
                {smallCents}
            </Text>
            <Text style={{ ...styles.price, ...st }}> €</Text>
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
        right: 11,
    },
});

export default PriceDisplay;
