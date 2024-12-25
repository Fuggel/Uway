import { useContext, useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import * as turf from "@turf/turf";

import { COLORS } from "@/constants/colors-constants";
import { REFETCH_INTERVAL } from "@/constants/env-constants";
import { SIZES } from "@/constants/size-constants";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useInstructions from "@/hooks/useInstructions";
import useTextToSpeech from "@/hooks/useTextToSpeech";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapTextToSpeechActions, mapTextToSpeechSelectors } from "@/store/mapTextToSpeech";
import { mapWaypointActions, mapWaypointSelectors } from "@/store/mapWaypoint";
import { SheetType } from "@/types/ISheet";
import { toGermanDate } from "@/utils/date-utils";
import { convertSpeedToKmh, determineSpeedLimitIcon } from "@/utils/map-utils";

import Card from "../common/Card";
import IconButton from "../common/IconButton";
import Text from "../common/Text";

const deviceHeight = Dimensions.get("window").height;

const MapNavigation = () => {
    const dispatch = useDispatch();
    const { stopSpeech } = useTextToSpeech();
    const { showSheet, openSheet } = useContext(BottomSheetContext);
    const { userLocation } = useContext(UserLocationContext);
    const directions = useSelector(mapNavigationSelectors.directions);
    const currentStep = useSelector(mapNavigationSelectors.currentStep);
    const location = useSelector(mapNavigationSelectors.location);
    const isGasStationWaypoint = useSelector(mapWaypointSelectors.gasStationWaypoints);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const allowTextToSpeech = useSelector(mapTextToSpeechSelectors.selectAllowTextToSpeech);
    const { remainingDistance, remainingTime, currentSpeedLimit } = useInstructions();
    const [arrivalTime, setArrivalTime] = useState<string | undefined>(undefined);

    const distance = `${(remainingDistance / 1000).toFixed(2).replace(".", ",")} km`;
    const duration = `${(remainingTime / 60).toFixed(0)} min`;

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;
    const userSpeed = userLocation?.coords?.speed;
    const currentSpeed = userSpeed && userSpeed > 0 ? convertSpeedToKmh(userSpeed).toFixed(0) : "0";

    const determineArrivalTime = () => {
        const now = new Date();
        now.setSeconds(now.getSeconds() + remainingTime);
        setArrivalTime(toGermanDate({ isoDate: now.toISOString(), showTimeOnly: true }));
    };

    const cancelNavigation = () => {
        dispatch(mapNavigationActions.handleCancelNavigation());
        stopSpeech();
    };

    const selectWaypoint = () => {
        dispatch(mapWaypointActions.setSelectGasStationWaypoint(true));
        openSheet({ type: SheetType.WAYPOINT });
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

    useEffect(() => {
        const steps = directions?.legs[0].steps;
        const lastStep = steps?.slice(-1)[0];
        const targetCoordinates = lastStep.geometry?.coordinates?.slice(-1)[0] || null;
        const userCoordinates = [longitude, latitude] as [number, number];

        if (targetCoordinates) {
            const from = turf.point(userCoordinates);
            const to = turf.point(targetCoordinates);

            const distance = turf.distance(from, to, { units: "meters" });

            if (steps[currentStep]?.maneuver?.type === "arrive" && distance <= 3) {
                cancelNavigation();
            }
        }
    }, [currentStep, directions]);

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

                    {currentSpeedLimit && (
                        <Image source={determineSpeedLimitIcon(currentSpeedLimit)} style={styles.speedLimitImage} />
                    )}
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
                            {location?.address_line1}
                        </Text>
                    )}

                    <Text type="lightGray" style={{ fontWeight: "bold" }}>
                        {duration} · {distance}
                    </Text>
                </View>

                <View style={styles.navigationActions}>
                    {!!isGasStationWaypoint ? (
                        <IconButton
                            icon="gas-station-off"
                            onPress={() => dispatch(mapWaypointActions.removeGasStationWaypoints())}
                            type="white"
                            size="lg"
                        />
                    ) : (
                        <IconButton icon="gas-station" onPress={selectWaypoint} type="white" size="lg" />
                    )}

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

                    <IconButton icon="close-circle" onPress={cancelNavigation} type="error" size="lg" />

                    {!isNavigationMode && (
                        <IconButton
                            icon="navigation"
                            onPress={() => {
                                dispatch(mapNavigationActions.setIsNavigationMode(true));
                                dispatch(mapNavigationActions.setTracking(true));
                                dispatch(mapNavigationActions.setIsNavigationSelecting(false));
                            }}
                            type="success"
                            size="lg"
                        />
                    )}
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
    speedLimitImage: {
        width: SIZES.iconSize.xl,
        height: SIZES.iconSize.xl,
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
