import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors-constants";
import { Location } from "../../types/IMap";
import { Direction, Instruction, RouteProfileType } from "@/src/types/INavigation";
import { SIZES } from "../../constants/size-constants";
import { useDispatch, useSelector } from "react-redux";
import { mapNavigationActions, mapNavigationSelectors } from "../../store/mapNavigation";
import Card from "../common/Card";
import { IconButton, SegmentedButtons } from "react-native-paper";
import { ROUTE_PROFILES } from "../../constants/map-constants";
import { arrowDirection } from "@/src/utils/map-utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useContext, useEffect } from "react";
import useInstructions from "@/src/hooks/useInstructions";
import { UserLocationContext } from "@/src/contexts/UserLocationContext";

interface MapNavigationProps {
    directions: Direction | null;
    locations: Location | null;
    setDirections: (directions: Direction | null) => void;
    setLocations: (locations: Location | null) => void;
}

const deviceHeight = Dimensions.get("window").height;

export default function MapNavigation({ directions, locations, setDirections, setLocations }: MapNavigationProps) {
    const { userLocation } = useContext(UserLocationContext);
    const dispatch = useDispatch();
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const profileType = useSelector(mapNavigationSelectors.navigationProfile);
    const { currentStep, setCurrentStep, remainingDistance, remainingTime } = useInstructions(directions, userLocation);

    const distance = `${(remainingDistance / 1000).toFixed(2).replace(".", ",")} km`;
    const duration = `${(remainingTime / 60).toFixed(0)} min`;
    const address = locations?.properties.name;
    const place = locations?.properties.place_formatted;

    const handleCancelNavigation = () => {
        setDirections(null);
        setCurrentStep(0);
        setLocations(null);
        dispatch(mapNavigationActions.setNavigationView(false));
        dispatch(mapNavigationActions.setIsNavigationMode(false));
        dispatch(mapNavigationActions.setSearchQuery(""));
        dispatch(mapNavigationActions.setLocationId(""));
    };

    useEffect(() => {
        if (directions && isNavigationMode && locations) {
            dispatch(mapNavigationActions.setNavigationView(true));
            dispatch(mapNavigationActions.setSearchQuery(""));
            setCurrentStep(0);
        }
    }, [isNavigationMode, directions]);

    useEffect(() => {
        if (directions?.legs[0].steps[currentStep]?.maneuver?.type === "arrive") {
            handleCancelNavigation();
        }
    }, [currentStep, directions]);

    return (
        <>
            {directions?.legs[0].steps.slice(currentStep, currentStep + 1).map((step: Instruction, index: number) => {
                const arrowDir = arrowDirection(step.maneuver.modifier);

                return (
                    <View key={index} style={styles.instructionsContainer}>
                        <Text style={styles.stepInstruction}>{step.maneuver.instruction}</Text>

                        <View style={styles.directionRow}>
                            {arrowDir !== undefined && (
                                <MaterialCommunityIcons
                                    name={arrowDir}
                                    size={SIZES.iconSize.xl}
                                    color={COLORS.primary}
                                />
                            )}
                            <Text style={styles.stepDistance}>{step.distance.toFixed(0)} m</Text>
                        </View>
                    </View>
                );
            })}

            <View style={styles.flexBottom}>
                {directions && isNavigationMode && (
                    <Card st={styles.card}>
                        <View>
                            <Text style={styles.navigationDuration}>
                                {duration} · {distance}
                            </Text>
                            <View style={styles.navigationInfo}>
                                <Text style={styles.navigationDistance}>{address}</Text>
                                <Text style={styles.navigationDistance}>{place}</Text>
                            </View>
                        </View>

                        <TouchableOpacity>
                            <IconButton
                                icon="close-circle"
                                size={SIZES.iconSize.xl}
                                iconColor={COLORS.error}
                                onPress={handleCancelNavigation}
                            />
                        </TouchableOpacity>
                    </Card>
                )}

                {locations && !isNavigationMode && (
                    <Card st={styles.card}>
                        <View style={styles.profileActions}>
                            <Text
                                style={{
                                    ...styles.navigationDuration,
                                    color: COLORS.gray,
                                }}
                            >
                                {address}, {place}
                            </Text>
                            <SegmentedButtons
                                value={profileType}
                                onValueChange={(value) =>
                                    dispatch(mapNavigationActions.setNavigationProfile(value as RouteProfileType))
                                }
                                buttons={ROUTE_PROFILES.map((p) => ({
                                    value: p.value,
                                    icon: p.icon,
                                    checkedColor: COLORS.white,
                                    style: {
                                        backgroundColor: p.value === profileType ? COLORS.primary : COLORS.white,
                                    },
                                }))}
                            />
                        </View>

                        <View style={styles.navigationActionButtons}>
                            <TouchableOpacity>
                                <IconButton
                                    icon="close-circle"
                                    size={SIZES.iconSize.xl}
                                    iconColor={COLORS.error}
                                    onPress={handleCancelNavigation}
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
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    instructionsContainer: {
        position: "absolute",
        top: deviceHeight > 1000 ? "4%" : "7%",
        left: SIZES.spacing.sm,
        maxWidth: "60%",
        backgroundColor: COLORS.white_transparent,
        borderRadius: SIZES.borderRadius.sm,
        padding: SIZES.spacing.sm,
    },
    flexBottom: {
        flex: 1,
        maxHeight: deviceHeight > 1000 ? "12%" : "18%",
        justifyContent: "center",
        backgroundColor: COLORS.white_transparent,
    },
    stepInstruction: {
        fontSize: SIZES.fontSize.md,
        fontWeight: "bold",
    },
    stepDistance: {
        fontSize: SIZES.fontSize.sm,
        color: COLORS.gray,
    },
    directionRow: {
        flexDirection: "row",
        alignItems: "center",
    },
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
    navigationInfo: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: SIZES.spacing.xs,
        gap: 2,
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
    },
});
