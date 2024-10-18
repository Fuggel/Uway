import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors-constants";

import Button from "./Button";

interface LinkProps {
    to: string;
}

const Link = ({ to }: LinkProps) => {
    const router = useRouter();

    return <Button icon="chevron-right" type="white" size="md" style={styles.button} onPress={() => router.push(to)} />;
};

export default Link;

const styles = StyleSheet.create({
    button: {
        margin: 0,
        width: 30,
        height: 30,
        backgroundColor: COLORS.primary,
    },
});
