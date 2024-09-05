import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors-constants";
import { Location } from "../../types/IMap";
import { Direction, RouteProfileType } from "@/src/types/INavigation";
import { SIZES } from "../../constants/size-constants";
import { useDispatch, useSelector } from "react-redux";
import { mapNavigationActions, mapNavigationSelectors } from "../../store/mapNavigation";
import Card from "../common/Card";
import { IconButton, SegmentedButtons } from "react-native-paper";
import { ROUTE_PROFILES } from "../../constants/map-constants";

interface MapNavigationProps {
    directions: Direction | null;
    locations: Location | null;
    onCancelNavigation: () => void;
}

export default function MapNavigation({
    directions,
    locations,
    onCancelNavigation,
}: MapNavigationProps) {
    const dispatch = useDispatch();
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const profileType = useSelector(mapNavigationSelectors.navigationProfile);

    const distance = `${(directions?.distance! / 1000).toFixed(2).replace(".", ",")} km`;
    const duration = `${(directions?.duration! / 60).toFixed(0)} min`;
    const address = locations?.properties.name;
    const place = locations?.properties.place_formatted;

    return (
        <>
            {directions && isNavigationMode && (
                <Card st={styles.card}>
                    <View>
                        <Text style={styles.navigationDuration}>{duration}</Text>
                        <Text style={styles.navigationDistance}>{distance} · {address}, {place}</Text>
                    </View>

                    <TouchableOpacity>
                        <IconButton
                            icon="close-circle"
                            size={SIZES.iconSize.xl}
                            iconColor={COLORS.error}
                            onPress={onCancelNavigation}
                        />
                    </TouchableOpacity>
                </Card>
            )}

            {locations && !isNavigationMode && (
                <Card st={styles.card}>
                    <View style={styles.profileActions}>
                        <Text style={{ ...styles.navigationDuration, color: COLORS.gray }}>
                            {address}, {place}
                        </Text>
                        <SegmentedButtons
                            value={profileType}
                            onValueChange={(value) => dispatch(mapNavigationActions.setNavigationProfile(value as RouteProfileType))}
                            buttons={ROUTE_PROFILES.map(p => ({
                                value: p.value,
                                icon: p.icon,
                                checkedColor: COLORS.white,
                                style: {
                                    backgroundColor: p.value === profileType ? COLORS.primary : COLORS.white,
                                }
                            }))}
                        />
                    </View>

                    <View style={styles.navigationActionButtons}>
                        <TouchableOpacity>
                            <IconButton
                                icon="close-circle"
                                size={SIZES.iconSize.xl}
                                iconColor={COLORS.error}
                                onPress={onCancelNavigation}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <IconButton
                                icon="navigation"
                                size={SIZES.iconSize.xl}
                                iconColor={COLORS.success}
                                onPress={() => dispatch(mapNavigationActions.setIsNavigationMode(true))}
                            />
                        </TouchableOpacity>
                    </View>
                </Card>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: SIZES.spacing.md,
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
    profileActions: {
        minWidth: "60%",
        maxWidth: "65%",
        gap: SIZES.spacing.xs,
    },
    navigationActionButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        maxWidth: "30%",
        marginLeft: SIZES.spacing.md,
    }
});