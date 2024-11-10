import { useContext, useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { MapFeatureContext } from "@/contexts/MapFeatureContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useTextToSpeech from "@/hooks/useTextToSpeech";
import { mapNavigationSelectors } from "@/store/mapNavigation";
import { Direction, Instruction } from "@/types/INavigation";
import { arrowDirection, determineIncidentIcon } from "@/utils/map-utils";

import Text from "../common/Text";
import Toast from "../common/Toast";

interface MapAlertsProps {
    directions: Direction | null;
    currentStep: number;
    speedCameraSuccess: boolean;
    speedCameraError: any;
}

const deviceHeight = Dimensions.get("window").height;

const MapAlerts = ({ directions, currentStep, speedCameraSuccess, speedCameraError }: MapAlertsProps) => {
    const { userLocation } = useContext(UserLocationContext);
    const { speedCameras, incidents } = useContext(MapFeatureContext);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const { startSpeech } = useTextToSpeech();

    const currentInstruction = directions?.legs[0].steps[currentStep].maneuver.instruction;

    useEffect(() => {
        if (isNavigationMode) {
            startSpeech(currentInstruction);
        }
    }, [isNavigationMode, currentInstruction, currentStep]);

    if (!userLocation) return null;

    return (
        <View style={styles.absoluteTop}>
            <View style={styles.alertContainer}>
                {isNavigationMode &&
                    directions?.legs[0].steps
                        .slice(currentStep, currentStep + 1)
                        .map((step: Instruction, index: number) => {
                            const arrowDir = arrowDirection(step.maneuver.modifier);

                            return (
                                <View key={index} style={styles.instructionsContainer}>
                                    <Text type="white" style={styles.stepInstruction}>
                                        {step.maneuver.instruction}
                                    </Text>

                                    <View style={styles.directionRow}>
                                        {arrowDir !== undefined && (
                                            <MaterialCommunityIcons
                                                name={arrowDir}
                                                size={SIZES.iconSize.xl}
                                                color={COLORS.white}
                                            />
                                        )}
                                        <Text type="white" textStyle="caption">
                                            {step.distance.toFixed(0)} m
                                        </Text>
                                    </View>
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

                <Toast
                    show={!!speedCameraError}
                    autoHide
                    type="error"
                    title="Fehler beim Melden"
                    subTitle={
                        speedCameraError?.response?.status === 403
                            ? "Du kannst nur alle 30 Minuten einen Blitzer melden."
                            : "Bitte versuche es erneut."
                    }
                />

                <Toast
                    show={speedCameraSuccess}
                    autoHide
                    type="success"
                    title="Blitzer gemeldet"
                    subTitle="Danke für deine Meldung."
                />
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
    },
    alertContainer: {
        gap: SIZES.spacing.sm,
        // width: "55%",
    },
    instructionsContainer: {
        borderRadius: SIZES.borderRadius.md,
        padding: SIZES.spacing.sm,
        backgroundColor: COLORS.secondary,
        gap: SIZES.spacing.xs,
    },
    stepInstruction: {
        fontWeight: "bold",
    },
    directionRow: {
        flexDirection: "row",
        alignItems: "center",
    },
});

export default MapAlerts;
