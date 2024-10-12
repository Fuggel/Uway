import { StyleSheet, View } from "react-native";
import { Divider } from "react-native-paper";

import { SIZES } from "@/constants/size-constants";

import Text from "../common/Text";

interface SettingsCommonProps {
    title?: string;
    children: React.ReactNode;
}

export const SettingsItem = ({ title, children }: SettingsCommonProps) => {
    return (
        <View style={styles.settingsItem}>
            <Text type="dark">{title}</Text>
            {children}
        </View>
    );
};

export const SettingsSection = ({ title, children }: SettingsCommonProps) => {
    return (
        <View style={styles.settingsSection}>
            <Text type="dark" style={styles.heading}>
                {title}
            </Text>
            <Divider style={styles.divider} />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    settingsSection: {
        marginVertical: SIZES.spacing.sm,
    },
    heading: {
        fontWeight: "bold",
    },
    divider: {
        marginTop: SIZES.spacing.xs,
    },
    settingsItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: SIZES.spacing.sm,
    },
});
