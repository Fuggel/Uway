import { StyleSheet, View, ViewStyle } from "react-native";

import { SIZES } from "@/constants/size-constants";

import Text from "./Text";

interface CardProps {
    title?: string;
    children: React.ReactNode;
    st?: ViewStyle;
}

const Card = ({ title, children, st }: CardProps) => {
    return (
        <View style={{ ...styles.card, ...st }}>
            <Text>{title}</Text>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        paddingHorizontal: SIZES.spacing.md,
        borderTopRightRadius: SIZES.borderRadius.lg,
        borderTopLeftRadius: SIZES.borderRadius.lg,
    },
});

export default Card;
