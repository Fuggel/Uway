import { useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { distance } from "@turf/turf";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { MapFeatureContext } from "@/contexts/MapFeatureContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useTextToSpeech from "@/hooks/useTextToSpeech";
import { mapNavigationSelectors } from "@/store/mapNavigation";
import { Instruction, InstructionThreshold, SpokenInstructions } from "@/types/INavigation";
import {
    arrowDirection,
    convertSpeedToKmh,
    determineIncidentIcon,
    instructionsWarningThresholds,
} from "@/utils/map-utils";
import { formatLength } from "@/utils/unit-utils";

import Text from "../common/Text";
import Toast from "../common/Toast";

const deviceHeight = Dimensions.get("window").height;

const MapAlerts = () => {
    const { userLocation } = useContext(UserLocationContext);
    const { speedCameras, incidents } = useContext(MapFeatureContext);
    const directions = useSelector(mapNavigationSelectors.directions);
    const currentStep = useSelector(mapNavigationSelectors.currentStep);
    const [spokenInstructions, setSpokenInstructions] = useState<SpokenInstructions>({
        [InstructionThreshold.CURRENT]: false,
        [InstructionThreshold.EARLY]: false,
        [InstructionThreshold.LATE]: false,
    });
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const { startSpeech } = useTextToSpeech();

    const currentStepData = directions?.legs[0]?.steps[currentStep];
    const nextStepData = directions?.legs[0]?.steps[currentStep + 1];

    const currentInstruction = currentStepData?.maneuver?.instruction;
    const nextInstruction = nextStepData?.maneuver?.instruction;

    const userSpeed = userLocation!.coords.speed;
    const currentSpeed = userSpeed && userSpeed > 0 ? convertSpeedToKmh(userSpeed) : 0;

    const distanceToNextStep = nextStepData?.maneuver?.location
        ? distance([userLocation!.coords.longitude, userLocation!.coords.latitude], nextStepData.maneuver.location, {
              units: "meters",
          })
        : null;

    useEffect(() => {
        setSpokenInstructions({
            [InstructionThreshold.CURRENT]: false,
            [InstructionThreshold.EARLY]: false,
            [InstructionThreshold.LATE]: false,
        });
    }, [currentStep, isNavigationMode]);

    useEffect(() => {
        if (!isNavigationMode || !currentInstruction || spokenInstructions.current) return;

        startSpeech(currentInstruction);
        setSpokenInstructions((prev) => ({ ...prev, [InstructionThreshold.CURRENT]: true }));
    }, [isNavigationMode, currentInstruction, spokenInstructions]);

    useEffect(() => {
        if (!isNavigationMode || !distanceToNextStep || !nextInstruction) return;

        const { early: earlyThreshold, late: lateThreshold } = instructionsWarningThresholds(currentSpeed);

        const thresholds = [
            {
                key: InstructionThreshold.EARLY,
                condition: distanceToNextStep <= earlyThreshold && distanceToNextStep > lateThreshold,
            },
            { key: InstructionThreshold.LATE, condition: distanceToNextStep <= lateThreshold },
        ];

        thresholds.forEach(({ key, condition }) => {
            if (!spokenInstructions[key] && condition) {
                startSpeech(`In ${Math.round(distanceToNextStep)} Metern, ${nextInstruction}`);
                setSpokenInstructions((prev) => ({ ...prev, [key]: true }));
            }
        });
    }, [isNavigationMode, distanceToNextStep, nextInstruction, spokenInstructions]);

    return (
        <View style={styles.absoluteTop}>
            <View style={styles.alertContainer}>
                {isNavigationMode &&
                    directions?.legs[0].steps
                        .slice(currentStep, currentStep + 1)
                        .map((step: Instruction, index: number) => {
                            const defaultArrow = "arrow-up-bold";

                            const arrowDir = arrowDirection(step?.maneuver?.modifier);
                            const arrowDirNext = arrowDirection(nextStepData?.maneuver?.modifier);

                            const arrowName = arrowDir ?? defaultArrow;
                            const arrowNameNext = arrowDirNext ?? defaultArrow;

                            return (
                                <View key={index}>
                                    <View style={styles.instructionsContainer}>
                                        <View style={styles.directionRow}>
                                            <MaterialCommunityIcons
                                                name={arrowName}
                                                size={SIZES.iconSize.xl}
                                                color={COLORS.white}
                                            />
                                            <Text type="white" textStyle="header">
                                                {formatLength(step.distance)}
                                            </Text>
                                        </View>
                                        <Text type="white">{step.maneuver.instruction}</Text>
                                    </View>

                                    {nextInstruction && (
                                        <View style={styles.nextInstructionContainer}>
                                            <View style={styles.directionRow}>
                                                <Text type="white">Dann</Text>
                                                <MaterialCommunityIcons
                                                    name={arrowNameNext}
                                                    size={SIZES.iconSize.lg}
                                                    color={COLORS.white}
                                                />
                                            </View>
                                        </View>
                                    )}
                                </View>
                            );
                        })}

                {speedCameras?.speedCameras?.alert && speedCameras?.speedCameraWarningText?.title && (
                    <Toast
                        show={!!speedCameras.speedCameras.alert}
                        type="error"
                        title={speedCameras.speedCameraWarningText.title}
                    />
                )}

                {incidents?.incidents?.alert && incidents?.incidentWarningText?.title && (
                    <Toast
                        show={!!incidents.incidents.alert}
                        type="error"
                        image={determineIncidentIcon(incidents.incidents.alert.events[0]?.iconCategory)}
                        title={incidents.incidentWarningText.title}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    absoluteTop: {
        position: "absolute",
        top: deviceHeight > 1000 ? "4%" : "7%",
        left: SIZES.spacing.sm,
        right: SIZES.spacing.sm,
        gap: SIZES.spacing.sm,
        pointerEvents: "none",
    },
    alertContainer: {
        gap: SIZES.spacing.sm,
        maxWidth: "60%",
    },
    instructionsContainer: {
        borderRadius: SIZES.borderRadius.md,
        borderBottomLeftRadius: 0,
        padding: SIZES.spacing.sm,
        backgroundColor: COLORS.secondary,
    },
    directionRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: SIZES.spacing.xs,
    },
    nextInstructionContainer: {
        padding: SIZES.spacing.sm,
        backgroundColor: COLORS.secondary_light,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: SIZES.borderRadius.sm,
        borderBottomRightRadius: SIZES.borderRadius.sm,
        alignSelf: "flex-start",
    },
});

export default MapAlerts;
