import { StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-paper";
import { SIZES } from "../constants/size-constants";

interface SettingsCommonProps {
    title?: string;
    children: React.ReactNode;
}

export function SettingsItem({ title, children }: SettingsCommonProps) {
    return (
        <View style={styles.settingsItem}>
            <Text>{title}</Text>
            {children}
        </View>
    );
}

export function SettingsSection({ title, children }: SettingsCommonProps) {
    return (
        <View style={styles.settingsSection}>
            <Text style={styles.heading}>{title}</Text>
            <Divider style={styles.divider} />
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    settingsSection: {
        marginVertical: SIZES.spacing.sm,
    },
    heading: {
        fontSize: SIZES.fontSize.md,
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
    }
});