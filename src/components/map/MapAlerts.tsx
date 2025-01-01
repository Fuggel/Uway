import { useContext } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { MapFeatureContext } from "@/contexts/MapFeatureContext";
import useInstructions from "@/hooks/useInstructions";
import { mapNavigationSelectors } from "@/store/mapNavigation";
import { determineIncidentIcon } from "@/utils/map-utils";
import { formatLength } from "@/utils/unit-utils";

import Text from "../common/Text";
import Toast from "../common/Toast";

const deviceHeight = Dimensions.get("window").height;

const MapAlerts = () => {
    const { speedCameras, incidents } = useContext(MapFeatureContext);
    const { currentInstruction, maneuverImage, laneImages } = useInstructions();
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);

    const maneuverImg = maneuverImage();
    const laneImg = laneImages();

    const isLanesAvailable = laneImg && laneImg.length > 0;

    return (
        <View style={styles.absoluteTop}>
            <View style={styles.alertContainer}>
                {currentInstruction && isNavigationMode && (
                    <View>
                        <View style={styles.instructionsContainer}>
                            <View style={styles.directionRow}>
                                <Image source={maneuverImg?.currentArrowDir} style={styles.arrowImage} />
                                <Text type="white" textStyle="header">
                                    {formatLength(currentInstruction.distanceToNextStep)}
                                </Text>
                            </View>
                            <Text type="white">{currentInstruction.bannerInstruction.primary.text}</Text>
                        </View>

                        {!isLanesAvailable && maneuverImg?.nextArrowDir && (
                            <View style={styles.nextInstructionContainer}>
                                <View style={styles.nextDirectionRow}>
                                    <Text type="white">Dann</Text>
                                    <Image source={maneuverImg?.nextArrowDir} style={styles.nextArrowImage} />
                                </View>
                            </View>
                        )}

                        {isLanesAvailable && (
                            <View style={styles.laneInstructionContainer}>
                                {laneImg.map((lane, i) => {
                                    if (!lane) return null;
                                    return <Image key={i} source={lane} style={{ width: 30, height: 30 }} />;
                                })}
                            </View>
                        )}
                    </View>
                )}

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
        borderBottomRightRadius: 0,
        padding: SIZES.spacing.sm,
        backgroundColor: COLORS.secondary,
    },
    directionRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: SIZES.spacing.xs,
    },
    nextDirectionRow: {
        flexDirection: "row",
        alignItems: "center",
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
    laneInstructionContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: SIZES.spacing.xs,
        backgroundColor: COLORS.secondary_light,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: SIZES.borderRadius.sm,
        borderBottomRightRadius: SIZES.borderRadius.sm,
        padding: SIZES.spacing.xs,
    },
    arrowImage: {
        width: SIZES.iconSize.xl,
        height: SIZES.iconSize.xl,
    },
    nextArrowImage: {
        width: SIZES.iconSize.lg,
        height: SIZES.iconSize.lg,
    },
});

export default MapAlerts;
