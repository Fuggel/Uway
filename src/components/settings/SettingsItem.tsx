import { StyleSheet, View } from "react-native";
import { Divider } from "react-native-paper";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

import Text from "../common/Text";

interface SettingsCommonProps {
    title?: string;
    children: React.ReactNode;
}

interface SettingsSectionProps extends SettingsCommonProps {
    icon: string;
}

export const SettingsItem = ({ title, children }: SettingsCommonProps) => {
    return (
        <View style={styles.settingsItem}>
            <Text>{title}</Text>
            {children}
        </View>
    );
};

export const SettingsSection = ({ title, icon, children }: SettingsSectionProps) => {
    return (
        <View style={styles.settingsSection}>
            <View style={styles.headingContainer}>
                <MaterialCommunityIcons name={icon as any} size={24} color={COLORS.primary} />
                <Text style={styles.heading}>{title}</Text>
            </View>
            <Divider style={styles.divider} />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    settingsSection: {
        marginVertical: SIZES.spacing.sm,
    },
    headingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: SIZES.spacing.xs,
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
