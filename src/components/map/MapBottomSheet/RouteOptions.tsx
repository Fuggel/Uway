import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { readableDistance, readableDuration } from "@/utils/map-utils";

import Text from "@/components/common/Text";

const RouteOptions = () => {
    const dispatch = useDispatch();
    const routeOptions = useSelector(mapNavigationSelectors.routeOptions);
    const selectedRoute = useSelector(mapNavigationSelectors.selectedRoute);

    const handleStartNavigation = () => {
        if (!routeOptions) return;

        dispatch(mapNavigationActions.setDirectNavigation(false));
        dispatch(mapNavigationActions.setDirections(routeOptions[selectedRoute]));
        dispatch(mapNavigationActions.setIsNavigationMode(true));
        dispatch(mapNavigationActions.setTracking(true));
        dispatch(mapNavigationActions.setIsNavigationSelecting(false));
        dispatch(mapNavigationActions.setRouteOptions(null));
        dispatch(mapNavigationActions.setSelectedRoute(0));
        dispatch(mapNavigationActions.setShowRouteOptions(false));
    };

    if (!routeOptions) return null;

    return (
        <View style={{ paddingBottom: SIZES.spacing.sm }}>
            {routeOptions.map((item, i) => (
                <ScrollView key={i} contentContainerStyle={styles.contentContainer}>
                    <Pressable
                        style={[styles.itemContainer, selectedRoute === i && styles.selectedRoute]}
                        onPress={() => dispatch(mapNavigationActions.setSelectedRoute(i))}
                    >
                        <View style={{ width: "80%", gap: SIZES.spacing.xs }}>
                            <Text textStyle="header" type={selectedRoute === i ? "white" : "lightGray"}>
                                {readableDuration(item.duration)}
                            </Text>

                            <Text type="lightGray">Über {item.legs[0].summary}</Text>
                        </View>

                        <Text type="lightGray">{readableDistance(item.distance)}</Text>
                    </Pressable>
                </ScrollView>
            ))}

            <View style={styles.actions}>
                <Button
                    mode="outlined"
                    style={{ width: "48%", backgroundColor: COLORS.light_gray }}
                    textColor={COLORS.primary}
                    onPress={() => dispatch(mapNavigationActions.handleCancelNavigation())}
                >
                    Abbrechen
                </Button>

                <Button
                    mode="contained"
                    style={{ width: "48%", backgroundColor: COLORS.secondary }}
                    textColor={COLORS.white}
                    onPress={() => handleStartNavigation()}
                >
                    Starten
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light_gray,
        paddingVertical: SIZES.spacing.sm,
        paddingRight: SIZES.spacing.sm + 5,
        paddingLeft: SIZES.spacing.sm,
        borderLeftWidth: 5,
        borderLeftColor: "transparent",
    },
    contentContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: "100%",
    },
    selectedRoute: {
        backgroundColor: COLORS.dark_gray,
        borderLeftWidth: 5,
        borderLeftColor: COLORS.secondary,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: SIZES.spacing.sm,
    },
});

export default RouteOptions;
