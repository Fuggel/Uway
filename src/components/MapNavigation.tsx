import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors-constants";
import { arrowDirection } from "../utils/map-utils";
import { Direction, Instruction } from "../types/IMap";
import { SIZES } from "../constants/size-constants";

interface MapNavigationProps {
    directions: Direction | null;
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function MapNavigation({ directions, currentStep, setCurrentStep }: MapNavigationProps) {
    return (
        <View style={styles.instructionsContainer}>
            {directions?.legs[0].steps
                .slice(currentStep, currentStep + 1)
                .map((step: Instruction, index: number) => {
                    const arrowDir = arrowDirection(step);

                    return (
                        <View key={index}>
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
        </View>
    );
}

const styles = StyleSheet.create({
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
});