import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors-constants";
import { arrowDirection } from "../utils/map-utils";
import { Direction, Instruction, Location, RouteProfileType } from "../types/IMap";
import { SIZES } from "../constants/size-constants";
import { useDispatch, useSelector } from "react-redux";
import { mapNavigationActions, mapNavigationSelectors } from "../store/mapNavigation";
import Card from "./Card";
import { IconButton, SegmentedButtons } from "react-native-paper";
import { ROUTE_PROFILES } from "../constants/map-constants";

interface MapNavigationProps {
    directions: Direction | null;
    locations: Location | null;
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    onCancelNavigation: () => void;
}

export default function MapNavigation({
    directions,
    locations,
    currentStep,
    setCurrentStep,
    onCancelNavigation,
}: MapNavigationProps) {
    const dispatch = useDispatch();
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const profileType = useSelector(mapNavigationSelectors.navigationProfile);

    const distance = `${(directions?.distance! / 1000).toFixed(2).replace(".", ",")} km`;
    const duration = `${(directions?.duration! / 60).toFixed(0)} min`;
    const address = locations?.properties.address;

    return (
        <>
            {directions && isNavigationMode &&
                <Card st={styles.card}>
                    <View>
                        <Text style={styles.navigationDuration}>{duration}</Text>
                        <Text style={styles.navigationDistance}>{distance} · {address}</Text>
                    </View>

                    <TouchableOpacity>
                        <IconButton
                            icon="close-circle"
                            size={50}
                            iconColor={COLORS.error}
                            onPress={onCancelNavigation}
                        />
                    </TouchableOpacity>
                </Card>
            }

            {locations && !isNavigationMode &&
                <Card st={styles.card}>
                    <View style={styles.profileActions}>
                        <Text style={{ ...styles.navigationDuration, color: COLORS.gray }}>{address}</Text>
                        <SegmentedButtons
                            value={profileType}
                            onValueChange={(value) => dispatch(mapNavigationActions.setNavigationProfile(value as RouteProfileType))}
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
                        <TouchableOpacity>
                            <IconButton
                                icon="close-circle"
                                size={50}
                                iconColor={COLORS.error}
                                onPress={onCancelNavigation}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <IconButton
                                icon="navigation"
                                size={50}
                                iconColor={COLORS.success}
                                onPress={() => dispatch(mapNavigationActions.setIsNavigationMode(true))}
                            />
                        </TouchableOpacity>
                    </View>
                </Card>
            }

            {directions?.legs[0].steps
                .slice(currentStep, currentStep + 1)
                .map((step: Instruction, index: number) => {
                    const arrowDir = arrowDirection(step);

                    return (
                        <View key={index} style={styles.instructionsContainer}>
                            <Text style={styles.stepInstruction}>
                                {step.maneuver.instruction}
                            </Text>

                            <View style={styles.directionRow}>
                                {arrowDir !== undefined &&
                                    <MaterialCommunityIcons
                                        name={`arrow-${arrowDir}-bold`}
                                        size={50}
                                        color={COLORS.primary}
                                    />
                                }
                                <TouchableOpacity onPress={() => setCurrentStep(index)}>
                                    <Text style={styles.stepDistance}>
                                        {step.distance.toFixed(0)} meters
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
        </>
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
    instructionsContainer: {
        position: "absolute",
        top: SIZES.spacing.xl,
        left: SIZES.spacing.md,
        width: "50%",
        backgroundColor: COLORS.white_transparent,
        borderRadius: SIZES.borderRadius.sm,
        padding: SIZES.spacing.sm,
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
    profileActions: {
        width: "60%",
        gap: SIZES.spacing.sm,
    },
    navigationActionButtons: {
        flexDirection: "row",
    }
});