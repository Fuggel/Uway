import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors-constants";

import IconButton from "./IconButton";

interface LinkProps {
    to: string;
}

const Link = ({ to }: LinkProps) => {
    const router = useRouter();

    return (
        <IconButton
            icon="chevron-right"
            type="white"
            size="md"
            style={styles.iconButton}
            onPress={() => router.push(to)}
        />
    );
};

export default Link;

const styles = StyleSheet.create({
    iconButton: {
        margin: 0,
        width: 30,
        height: 30,
        backgroundColor: COLORS.primary,
    },
});
