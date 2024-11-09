import React from "react";
import { StyleSheet, View } from "react-native";

import { COLORS } from "@/constants/colors-constants";

import Text from "../common/Text";

interface NoResultsProps {
    text: string;
}

const NoResults = ({ text }: NoResultsProps) => {
    return (
        <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>{text}</Text>
        </View>
    );
};

export default NoResults;

const styles = StyleSheet.create({
    noResultsContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    noResultsText: {
        color: COLORS.medium_gray,
    },
});
