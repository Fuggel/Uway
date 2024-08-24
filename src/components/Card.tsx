import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SIZES } from "../constants/size-constants";

interface CardProps {
    title?: string;
    children: React.ReactNode;
    st?: any;
}

export default function Card({ title, children, st }: CardProps) {
    return (
        <View style={{ ...styles.card, ...st }}>
            <Text style={styles.title}>{title}</Text>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        paddingHorizontal: SIZES.spacing.md,
        borderTopRightRadius: SIZES.borderRadius.lg,
        borderTopLeftRadius: SIZES.borderRadius.lg,
    },
    title: {
        marginBottom: 4,
    }
});