import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors-constants";
import { SIZES } from "../constants/size-constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Card from "./Card";
import { Direction, Location, RouteProfileType } from "../types/IMap";
import { SegmentedButtons } from "react-native-paper";
import { ROUTE_PROFILES } from "../constants/map-constants";


interface MapButtonsProps {
    navigationView: boolean;
    setNavigationView: React.Dispatch<React.SetStateAction<boolean>>;
    directions: Direction | null;
    locations: Location | null;
    isNavigationMode: boolean;
    setIsNavigationMode: React.Dispatch<React.SetStateAction<boolean>>;
    profileType: RouteProfileType;
    setProfileType: React.Dispatch<React.SetStateAction<RouteProfileType>>;
    onCancelNavigation: () => void;
}

export default function MapButtons({
    navigationView,
    setNavigationView,
    directions,
    locations,
    isNavigationMode,
    setIsNavigationMode,
    profileType,
    setProfileType,
    onCancelNavigation,
}: MapButtonsProps) {
    const distance = `${(directions?.distance! / 1000).toFixed(2).replace(".", ",")} km`;
    const duration = `${(directions?.duration! / 60).toFixed(0)} min`;
    const address = locations?.properties.address;

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

            {directions && isNavigationMode &&
                <Card st={styles.card}>
                    <View>
                        <Text style={styles.navigationDuration}>{duration}</Text>
                        <Text style={styles.navigationDistance}>{distance} · {address}</Text>
                    </View>

                    <MaterialCommunityIcons
                        name="close-circle"
                        size={50}
                        onPress={onCancelNavigation}
                        color={COLORS.error}
                    />
                </Card>
            }

            {locations && !isNavigationMode &&
                <Card st={styles.card}>
                    <View style={styles.profileActions}>
                        <Text style={{ ...styles.navigationDuration, color: COLORS.gray }}>{address}</Text>
                        <SegmentedButtons
                            value={profileType}
                            onValueChange={setProfileType as (value: string) => void}
                            buttons={ROUTE_PROFILES.map(p => (
                                {
                                    value: p.value,
                                    icon: p.icon,
                                    checkedColor: COLORS.white,
                                    style: {
                                        backgroundColor: p.value === profileType ? COLORS.primary : COLORS.white,
                                    }
                                }
                            ))}
                        />
                    </View>

                    <View style={styles.navigationActionButtons}>
                        <MaterialCommunityIcons
                            name="close-circle"
                            size={50}
                            onPress={onCancelNavigation}
                            color={COLORS.error}
                        />
                        <MaterialCommunityIcons
                            name="navigation"
                            size={50}
                            onPress={() => setIsNavigationMode(true)}
                            color={COLORS.success}
                        />
                    </View>
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
        textAlign: "center",
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
    profileActions: {
        width: "60%",
        gap: SIZES.spacing.sm,
    },
    navigationActionButtons: {
        flexDirection: "row",
        gap: SIZES.spacing.sm,
    }
});