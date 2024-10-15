import { useContext } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useIncidents from "@/hooks/useIncidents";
import useInstructions from "@/hooks/useInstructions";
import useSpeedCameras from "@/hooks/useSpeedCameras";
import useSpeedLimits from "@/hooks/useSpeedLimits";
import { Direction, Instruction } from "@/types/INavigation";
import { SpeedCameraProperties, SpeedLimitFeature } from "@/types/ISpeed";
import { IncidentProperties } from "@/types/ITraffic";
import { arrowDirection, determineIncidentIcon, determineSpeedLimitIcon } from "@/utils/map-utils";
import { incidentTitle } from "@/utils/sheet-utils";

import Text from "../common/Text";
import Toast from "../common/Toast";
import MapSearchbar from "./MapSearchbar";

interface MapAlertsProps {
    directions: Direction | null;
    currentStep: number;
}

const deviceHeight = Dimensions.get("window").height;

const MapAlerts = ({ directions, currentStep }: MapAlertsProps) => {
    const { userLocation } = useContext(UserLocationContext);
    const { speedCameras } = useSpeedCameras();
    const { speedLimits } = useSpeedLimits();
    const { incidents } = useIncidents();

    const userSpeed = userLocation?.coords?.speed;
    const currentSpeed = userSpeed && userSpeed > 0 ? (userSpeed * 3.6).toFixed(1) : "0";

    const speedCameraProperties = speedCameras?.data.features[0]?.properties as SpeedCameraProperties | undefined;
    const incidentProperties = incidents?.data.incidents[0]?.properties as IncidentProperties | undefined;

    return (
        <>
            <View style={styles.absoluteTop}>
                {!directions && userLocation && <MapSearchbar />}

                <View style={styles.alertContainer}>
                    {directions?.legs[0].steps
                        .slice(currentStep, currentStep + 1)
                        .map((step: Instruction, index: number) => {
                            const arrowDir = arrowDirection(step.maneuver.modifier);

                            return (
                                <View key={index} style={styles.instructionsContainer}>
                                    <Text type="dark" style={styles.stepInstruction}>
                                        {step.maneuver.instruction}
                                    </Text>

                                    <View style={styles.directionRow}>
                                        {arrowDir !== undefined && (
                                            <MaterialCommunityIcons
                                                name={arrowDir}
                                                size={SIZES.iconSize.xl}
                                                color={COLORS.primary}
                                            />
                                        )}
                                        <Text type="secondary" textStyle="caption">
                                            {step.distance.toFixed(0)} m
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}

                    {speedCameras?.alert && (
                        <Toast
                            show={!!speedCameras.alert}
                            type="error"
                            title={`Blitzer in ${speedCameras.alert.distance.toFixed(0)} m`}
                            subTitle={
                                speedCameraProperties?.maxspeed
                                    ? `Max. ${speedCameraProperties.maxspeed} km/h`
                                    : undefined
                            }
                        />
                    )}

                    {incidents?.alert && (
                        <Toast
                            show={!!incidents.alert}
                            type="error"
                            image={determineIncidentIcon(incidents.alert.events[0]?.iconCategory)}
                            title={`${incidentTitle(incidentProperties)} in ${incidents.alert?.distance.toFixed(0)} m`}
                        />
                    )}
                </View>
            </View>

            <View style={styles.absoluteBottom}>
                <View style={styles.speedContainer}>
                    {userLocation?.coords && (
                        <Toast show type="info">
                            <Text type="dark" style={styles.alertMsg}>
                                {currentSpeed}
                            </Text>
                            <Text type="dark" style={{ textAlign: "center" }}>
                                km/h
                            </Text>
                        </Toast>
                    )}

                    {speedLimits?.alert && (
                        <Image
                            source={determineSpeedLimitIcon(
                                (speedLimits.alert.feature.properties as SpeedLimitFeature).maxspeed
                            )}
                            style={styles.speedLimitImage}
                        />
                    )}
                </View>
            </View>
        </>
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
        width: "55%",
    },
    instructionsContainer: {
        borderRadius: SIZES.borderRadius.sm,
        padding: SIZES.spacing.sm,
        backgroundColor: COLORS.white_transparent,
        gap: SIZES.spacing.xs,
    },
    absoluteBottom: {
        position: "absolute",
        bottom: "2%",
        left: SIZES.spacing.sm,
        width: "100%",
        pointerEvents: "none",
    },
    stepInstruction: {
        fontWeight: "bold",
    },
    directionRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    speedContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: SIZES.spacing.sm,
    },
    alertMsg: {
        fontWeight: "bold",
        textAlign: "center",
    },
    speedLimitImage: {
        width: 75,
        height: 75,
    },
});

export default MapAlerts;
