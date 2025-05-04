import { useContext } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { MapFeatureContext } from "@/contexts/MapFeatureContext";
import { MapInstructionContext } from "@/contexts/MapInstructionContext";
import { mapNavigationSelectors } from "@/store/mapNavigation";
import { IncidentType } from "@/types/ITraffic";
import { determineIncidentIcon } from "@/utils/map-utils";
import { formatLength } from "@/utils/unit-utils";

import Alert from "../common/Alert";
import Text from "../common/Text";
import RoadShield from "../ui/RoadShield";

const deviceHeight = Dimensions.get("window").height;

const MapAlerts = () => {
    const { speedCameras, incidents } = useContext(MapFeatureContext);
    const { currentInstruction, maneuverImage, laneImages } = useContext(MapInstructionContext);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);

    const maneuverImg = maneuverImage();
    const laneImg = laneImages();

    const isLanesAvailable = laneImg && laneImg.length > 0;

    return (
        <View style={styles.absoluteTop}>
            <View style={styles.alertContainer}>
                {currentInstruction && isNavigationMode && (
                    <View>
                        <View style={styles.directionRow}>
                            <Image source={maneuverImg?.currentArrowDir} style={styles.arrowImage} />

                            <View style={styles.intructionsContainer}>
                                <View style={styles.instructionsHeading}>
                                    <Text type="white" textStyle="header">
                                        {formatLength(currentInstruction.distanceToNextStep)}
                                    </Text>

                                    <View style={styles.roadShieldContainer}>
                                        {currentInstruction?.shieldInformation?.icon
                                            ?.filter((shield) => shield !== null)
                                            .map((shield, i) => (
                                                <RoadShield
                                                    key={i}
                                                    type={shield.type}
                                                    name={shield.name}
                                                    display_ref={shield.display_ref}
                                                    text_color={shield.text_color}
                                                />
                                            ))}
                                    </View>
                                </View>

                                <Text type="white" textStyle="header">
                                    {currentInstruction.shieldInformation?.text
                                        ? currentInstruction.shieldInformation.text
                                        : currentInstruction?.bannerInstruction?.primary?.text}
                                </Text>
                            </View>
                        </View>

                        {!isLanesAvailable && maneuverImg?.nextArrowDir && (
                            <View style={styles.nextInstructionContainer}>
                                <View style={styles.nextDirectionRow}>
                                    <Text type="white">Dann:</Text>
                                    <Image source={maneuverImg?.nextArrowDir} style={styles.nextArrowImage} />
                                </View>
                            </View>
                        )}

                        {isLanesAvailable && (
                            <View style={styles.laneInstructionContainer}>
                                {laneImg.map((lane, i) => {
                                    if (!lane) return null;
                                    return <Image key={i} source={lane} style={styles.laneImage} />;
                                })}
                            </View>
                        )}
                    </View>
                )}

                {speedCameras && speedCameras?.speedCameraWarning?.text && (
                    <Alert
                        show={!!speedCameras.speedCameraWarning.text}
                        type="error"
                        title={speedCameras.speedCameraWarning.text}
                    />
                )}

                {incidents && incidents?.incidentWarning?.text && (
                    <Alert
                        show={!!incidents.incidentWarning.text}
                        type="error"
                        image={determineIncidentIcon(incidents.incidentWarning.eventWarningType as IncidentType)}
                        title={incidents.incidentWarning.text}
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
    },
    intructionsContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
    },
    directionRow: {
        borderTopRightRadius: SIZES.borderRadius.md,
        borderTopLeftRadius: SIZES.borderRadius.md,
        padding: SIZES.spacing.sm,
        backgroundColor: COLORS.secondary,
        flexDirection: "row",
        gap: SIZES.spacing.sm,
    },
    nextDirectionRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    nextInstructionContainer: {
        paddingHorizontal: SIZES.spacing.sm,
        paddingVertical: SIZES.spacing.xxs,
        backgroundColor: COLORS.secondary_light,
        borderBottomLeftRadius: SIZES.borderRadius.md,
        borderBottomRightRadius: SIZES.borderRadius.md,
        alignSelf: "flex-start",
    },
    laneInstructionContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: SIZES.spacing.xs,
        backgroundColor: COLORS.secondary_light,
        borderBottomRightRadius: SIZES.borderRadius.md,
        borderBottomLeftRadius: SIZES.borderRadius.md,
        padding: SIZES.spacing.xs,
    },
    instructionsHeading: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: SIZES.spacing.xxs,
    },
    laneImage: {
        width: 30,
        height: 30,
    },
    arrowImage: {
        width: SIZES.iconSize.xl,
        height: SIZES.iconSize.xl,
    },
    nextArrowImage: {
        width: SIZES.iconSize.lg,
        height: SIZES.iconSize.lg,
    },
    roadShieldContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: SIZES.spacing.xs,
    },
});

export default MapAlerts;
