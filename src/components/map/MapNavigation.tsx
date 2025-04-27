import { useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { REFETCH_INTERVAL } from "@/constants/env-constants";
import { SIZES } from "@/constants/size-constants";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { MapFeatureContext } from "@/contexts/MapFeatureContext";
import { MapInstructionContext } from "@/contexts/MapInstructionContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapTextToSpeechActions, mapTextToSpeechSelectors } from "@/store/mapTextToSpeech";
import { SpeedLimitFeature } from "@/types/ISpeed";
import { toGermanDate } from "@/utils/date-utils";
import { convertSpeedToKmh, readableStringDistance, readableStringDuration } from "@/utils/map-utils";

import Card from "../common/Card";
import IconButton from "../common/IconButton";
import Text from "../common/Text";
import SpeedLimit from "../ui/SpeedLimit";

const deviceHeight = Dimensions.get("window").height;

const MapNavigation = () => {
    const dispatch = useDispatch();
    const { showSheet } = useContext(BottomSheetContext);
    const { userLocation } = useContext(UserLocationContext);
    const { currentAnnotation } = useContext(MapInstructionContext);
    const { speedLimits } = useContext(MapFeatureContext);
    const directions = useSelector(mapNavigationSelectors.directions);
    const location = useSelector(mapNavigationSelectors.location);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const allowTextToSpeech = useSelector(mapTextToSpeechSelectors.selectAllowTextToSpeech);
    const [arrivalTime, setArrivalTime] = useState<string | undefined>(undefined);

    const userSpeed = userLocation?.coords?.speed;
    const currentSpeed = userSpeed && userSpeed > 0 ? convertSpeedToKmh(userSpeed).toFixed(0) : "0";
    const remainingTime = currentAnnotation?.remainingTime || 0;

    const speedLimit = (speedLimits.speedLimits?.feature?.properties as SpeedLimitFeature)?.maxspeed;

    const determineArrivalTime = () => {
        const now = new Date();
        now.setSeconds(now.getSeconds() + remainingTime);
        setArrivalTime(toGermanDate({ isoDate: now.toISOString(), showTimeOnly: true }));
    };

    useEffect(() => {
        determineArrivalTime();

        const intervalId = setInterval(() => {
            determineArrivalTime();
        }, REFETCH_INTERVAL.ARRIVAL_TIME_IN_SECONDS);

        return () => clearInterval(intervalId);
    }, [remainingTime]);

    useEffect(() => {
        if (directions && isNavigationMode && location) {
            dispatch(mapNavigationActions.setNavigationView(true));
            dispatch(mapNavigationActions.setSearchQuery(""));
        }
    }, [isNavigationMode, directions]);

    return (
        <View style={{ ...styles.container, display: showSheet ? "none" : "flex" }}>
            {userLocation?.coords && isNavigationMode && (
                <View style={styles.navigationSpeed}>
                    <View>
                        <Text type="white" style={styles.navigationSpeedText}>
                            {currentSpeed}
                        </Text>
                        <Text type="white" style={{ textAlign: "center" }}>
                            km/h
                        </Text>
                    </View>

                    {!!speedLimit && <SpeedLimit maxSpeed={speedLimit} />}
                </View>
            )}

            <Card st={styles.navigationCard}>
                <View style={styles.navigationInfo}>
                    {isNavigationMode ? (
                        <Text type="white" textStyle="header">
                            {arrivalTime} Uhr
                        </Text>
                    ) : (
                        <Text type="white" textStyle="header">
                            {location?.name}
                        </Text>
                    )}

                    <Text type="lightGray" style={{ fontWeight: "bold" }}>
                        {readableStringDuration(currentAnnotation?.remainingDuration)} ·{" "}
                        {readableStringDistance(currentAnnotation?.remainingDistance)}
                    </Text>
                </View>

                <View style={styles.navigationActions}>
                    {isNavigationMode && (
                        <IconButton
                            icon={allowTextToSpeech ? "volume-high" : "volume-off"}
                            onPress={() =>
                                allowTextToSpeech
                                    ? dispatch(mapTextToSpeechActions.setAllowTextToSpeech(false))
                                    : dispatch(mapTextToSpeechActions.setAllowTextToSpeech(true))
                            }
                            type="white"
                            size="lg"
                        />
                    )}

                    <IconButton
                        icon="close-circle"
                        type="error"
                        size="lg"
                        onPress={() => dispatch(mapNavigationActions.handleCancelNavigation())}
                    />
                </View>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: deviceHeight > 1000 ? "2%" : "4%",
        left: SIZES.spacing.sm,
        right: SIZES.spacing.sm,
        gap: SIZES.spacing.sm,
        pointerEvents: "box-none",
    },
    navigationCard: {
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.spacing.sm,
        paddingHorizontal: SIZES.spacing.md,
        borderRadius: SIZES.borderRadius.md,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
    },
    navigationSpeed: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: SIZES.spacing.sm,
        backgroundColor: COLORS.primary,
        padding: SIZES.spacing.sm,
        borderRadius: SIZES.borderRadius.md,
    },
    navigationSpeedText: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: SIZES.fontSize.lg,
    },
    navigationInfo: {
        flex: 1,
        justifyContent: "center",
    },
    navigationActions: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-end",
    },
});

export default MapNavigation;
