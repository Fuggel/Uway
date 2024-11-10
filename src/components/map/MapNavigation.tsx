import { useContext, useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { ARRIVAL_TIME_REFETCH_INTERVAL } from "@/constants/time-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useInstructions from "@/hooks/useInstructions";
import useSpeedLimits from "@/hooks/useSpeedLimits";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { Direction } from "@/types/INavigation";
import { OpenSheet, SheetType } from "@/types/ISheet";
import { SpeedLimitFeature } from "@/types/ISpeed";
import { toGermanDate } from "@/utils/date-utils";
import { determineSpeedLimitIcon } from "@/utils/map-utils";

import Card from "../common/Card";
import IconButton from "../common/IconButton";
import Text from "../common/Text";

interface MapNavigationProps {
    openSheet: OpenSheet;
    directions: Direction | null;
    setDirections: (directions: Direction | null) => void;
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const deviceHeight = Dimensions.get("window").height;

const MapNavigation = ({ openSheet, directions, setDirections, currentStep, setCurrentStep }: MapNavigationProps) => {
    const { userLocation } = useContext(UserLocationContext);
    const dispatch = useDispatch();
    const location = useSelector(mapNavigationSelectors.location);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const { speedLimits } = useSpeedLimits();
    const { remainingDistance, remainingTime } = useInstructions({
        currentStep,
        setCurrentStep,
        directions,
        userLocation,
    });
    const [arrivalTime, setArrivalTime] = useState<string | undefined>(undefined);

    const distance = `${(remainingDistance / 1000).toFixed(2).replace(".", ",")} km`;
    const duration = `${(remainingTime / 60).toFixed(0)} min`;

    const userSpeed = userLocation?.coords?.speed;
    const currentSpeed = userSpeed && userSpeed > 0 ? (userSpeed * 3.6).toFixed(0) : "0";

    const handleCancelNavigation = () => {
        setDirections(null);
        setCurrentStep(0);
        dispatch(mapNavigationActions.setLocation(null));
        dispatch(mapNavigationActions.setNavigationView(false));
        dispatch(mapNavigationActions.setIsNavigationMode(false));
        dispatch(mapNavigationActions.setSearchQuery(""));
    };

    const determineArrivalTime = () => {
        const now = new Date();
        now.setSeconds(now.getSeconds() + remainingTime);
        setArrivalTime(toGermanDate({ isoDate: now.toISOString(), showTimeOnly: true }));
    };

    useEffect(() => {
        determineArrivalTime();

        const intervalId = setInterval(() => {
            determineArrivalTime();
        }, ARRIVAL_TIME_REFETCH_INTERVAL);

        return () => clearInterval(intervalId);
    }, [remainingTime]);

    useEffect(() => {
        if (directions && isNavigationMode && location) {
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
        <View style={styles.container}>
            <View style={styles.navigationSpeed}>
                {userLocation?.coords && (
                    <View>
                        <Text type="white" style={styles.navigationSpeedText}>
                            {currentSpeed}
                        </Text>
                        <Text type="white" style={{ textAlign: "center" }}>
                            km/h
                        </Text>
                    </View>
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

                    <Text type="lightSecondary" style={{ fontWeight: "bold" }}>
                        {duration} · {distance}
                    </Text>
                </View>

                <View style={styles.navigationActions}>
                    <IconButton icon="close-circle" onPress={handleCancelNavigation} type="error" size="xl" />
                    {!isNavigationMode ? (
                        <IconButton
                            icon="navigation"
                            onPress={() => dispatch(mapNavigationActions.setIsNavigationMode(true))}
                            type="success"
                            size="xl"
                        />
                    ) : (
                        <IconButton
                            size="xl"
                            type="warning"
                            icon="alert"
                            onPress={() => openSheet({ type: SheetType.REPORT })}
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
    },
    navigationCard: {
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.spacing.md,
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
        borderRadius: SIZES.borderRadius.sm,
    },
    navigationSpeedText: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: SIZES.fontSize.lg,
    },
    speedLimitImage: {
        width: SIZES.iconSize.xxl,
        height: SIZES.iconSize.xxl,
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
