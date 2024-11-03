import { useContext, useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { ROUTE_PROFILES } from "@/constants/map-constants";
import { SIZES } from "@/constants/size-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useInstructions from "@/hooks/useInstructions";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { Direction, RouteProfileType } from "@/types/INavigation";

import Card from "../common/Card";
import IconButton from "../common/IconButton";
import Text from "../common/Text";

interface MapNavigationProps {
    directions: Direction | null;
    setDirections: (directions: Direction | null) => void;
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const deviceHeight = Dimensions.get("window").height;

const MapNavigation = ({ directions, setDirections, currentStep, setCurrentStep }: MapNavigationProps) => {
    const { userLocation } = useContext(UserLocationContext);
    const dispatch = useDispatch();
    const location = useSelector(mapNavigationSelectors.location);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const profileType = useSelector(mapNavigationSelectors.navigationProfile);
    const { remainingDistance, remainingTime } = useInstructions({
        currentStep,
        setCurrentStep,
        directions,
        userLocation,
    });

    const distance = `${(remainingDistance / 1000).toFixed(2).replace(".", ",")} km`;
    const duration = `${(remainingTime / 60).toFixed(0)} min`;
    const address = location?.address_line1;
    const place = location?.address_line2;

    const handleCancelNavigation = () => {
        setDirections(null);
        setCurrentStep(0);
        dispatch(mapNavigationActions.setLocation(null));
        dispatch(mapNavigationActions.setNavigationView(false));
        dispatch(mapNavigationActions.setIsNavigationMode(false));
        dispatch(mapNavigationActions.setSearchQuery(""));
    };

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
        <View style={styles.flexBottom}>
            {directions && location && (
                <Card st={styles.card}>
                    <View style={styles.profileActions}>
                        <View style={styles.navigationInfo}>
                            <Text type="secondary">{address}</Text>
                            <Text type="secondary">{place}</Text>
                        </View>
                        <Text type="success" textStyle="header" style={{ textAlign: "center" }}>
                            {duration} · {distance}
                        </Text>
                        {!isNavigationMode && (
                            <SegmentedButtons
                                value={profileType}
                                onValueChange={(value) =>
                                    dispatch(mapNavigationActions.setNavigationProfile(value as RouteProfileType))
                                }
                                buttons={ROUTE_PROFILES.map((p) => ({
                                    value: p.value,
                                    icon: p.icon,
                                    checkedColor: COLORS.white,
                                    style: {
                                        backgroundColor: p.value === profileType ? COLORS.primary : COLORS.white,
                                    },
                                }))}
                            />
                        )}
                    </View>

                    <View style={styles.navigationActionIconButtons}>
                        <IconButton icon="close-circle" onPress={handleCancelNavigation} type="error" size="xl" />
                        {!isNavigationMode && (
                            <IconButton
                                icon="navigation"
                                onPress={() => dispatch(mapNavigationActions.setIsNavigationMode(true))}
                                type="success"
                                size="xl"
                            />
                        )}
                    </View>
                </Card>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    flexBottom: {
        maxHeight: deviceHeight > 1000 ? "12%" : "18%",
        justifyContent: "center",
    },
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: SIZES.spacing.md,
    },
    navigationDuration: {
        textAlign: "center",
    },
    navigationInfo: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: SIZES.spacing.xs,
        gap: 2,
    },
    profileActions: {
        minWidth: "60%",
        maxWidth: "65%",
        gap: SIZES.spacing.xs,
    },
    navigationActionIconButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        maxWidth: "30%",
        marginLeft: SIZES.spacing.md,
    },
});

export default MapNavigation;
