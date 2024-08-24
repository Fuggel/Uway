import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors-constants";
import { SIZES } from "../constants/size-constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Card from "./Card";
import { Direction, Location } from "../types/IMap";


interface MapButtonsProps {
    navigationView: boolean;
    setNavigationView: React.Dispatch<React.SetStateAction<boolean>>;
    directions: Direction | null;
    locations: Location | null;
    onCancelNavigation: () => void;
}

export default function MapButtons({
    navigationView,
    setNavigationView,
    directions,
    locations,
    onCancelNavigation,
}: MapButtonsProps) {
    return (
        <View style={styles.mapButtons}>
            <TouchableOpacity>
                <MaterialCommunityIcons
                    name="navigation-variant"
                    size={SIZES.iconSize.lg}
                    style={styles.navigationViewButton}
                    onPress={() => setNavigationView((prev) => !prev)}
                    color={navigationView ? COLORS.primary : COLORS.white}
                />
            </TouchableOpacity>

            {directions?.distance && directions.duration &&
                <Card st={styles.card}>
                    <View>
                        <Text style={styles.navigationDuration}>
                            {(directions.duration / 60).toFixed(0)} min
                        </Text>
                        <Text style={styles.navigationDistance}>
                            {(directions.distance / 1000).toFixed(2).replace(".", ",")} km · {locations?.properties.address}
                        </Text>
                    </View>

                    <MaterialCommunityIcons
                        name="close-circle"
                        size={50}
                        onPress={onCancelNavigation}
                        color={COLORS.error}
                    />
                </Card>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLORS.white_transparent,
        paddingVertical: SIZES.spacing.sm,
    },
    navigationDuration: {
        color: COLORS.success,
        fontSize: SIZES.fontSize.lg,
        fontWeight: "bold",
    },
    navigationDistance: {
        color: COLORS.gray,
        fontSize: SIZES.fontSize.md,
    },
    mapButtons: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        gap: 4,
    },
    navigationViewButton: {
        marginLeft: "auto",
        marginRight: SIZES.spacing.md,
        marginBottom: SIZES.spacing.sm,
    },
});