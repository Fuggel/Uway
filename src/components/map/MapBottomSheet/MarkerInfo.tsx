import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapWaypointActions } from "@/store/mapWaypoint";
import { SearchLocation } from "@/types/ISearch";
import { generateRandomId } from "@/utils/auth-utils";

import IconButton from "@/components/common/IconButton";
import Text from "@/components/common/Text";

interface MarkerInfoProps {
    title: string;
    data: { label: string; value: string | number | React.ReactNode }[] | null;
    gasStation?: {
        show: boolean;
    };
}

const MarkerInfo = ({ title, data, gasStation }: MarkerInfoProps) => {
    const dispatch = useDispatch();
    const directions = useSelector(mapNavigationSelectors.directions);
    const { sheetData, closeSheet } = useContext(BottomSheetContext);

    const navigateToGasStation = () => {
        const street = sheetData?.markerProperties.street;
        const houseNumber = sheetData?.markerProperties.houseNumber || "";
        const postcode = sheetData?.markerProperties.postCode || "";
        const city = sheetData?.markerProperties.place || "";
        const country = "Deutschland";

        const newLocation: SearchLocation = {
            default_id: generateRandomId(),
            name: `${street} ${houseNumber}`,
            feature_type: "custom-waypoint",
            address: `${street} ${houseNumber}`,
            full_address: `${postcode} ${city}`,
            place_formatted: `${sheetData?.markerProperties.brand}, ${postcode} ${city}, ${country}`,
            maki: "fuel",
            coordinates: {
                longitude: sheetData?.markerProperties.lng,
                latitude: sheetData?.markerProperties.lat,
            },
        };

        dispatch(mapNavigationActions.setLocation(newLocation));
        closeSheet();
    };

    const waypointGasStation = () => {
        dispatch(
            mapWaypointActions.setGasStationWaypoints({
                lon: sheetData?.markerProperties.lng,
                lat: sheetData?.markerProperties.lat,
            })
        );
        closeSheet();
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text textStyle="header" style={styles.title}>
                    {title}
                </Text>
                {gasStation?.show && (
                    <View style={styles.iconButtonRight}>
                        {directions && (
                            <IconButton
                                icon="map-marker-plus"
                                size="md"
                                type="secondary"
                                onPress={waypointGasStation}
                            />
                        )}
                        <IconButton icon="directions" size="md" type="secondary" onPress={navigateToGasStation} />
                    </View>
                )}
            </View>

            {data?.map((item, i) => (
                <View key={i} style={styles.itemContainer}>
                    <Text type="gray">{item.label}:</Text>
                    <Text style={styles.textValue}>{item.value}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: SIZES.spacing.md,
        paddingBottom: SIZES.spacing.md,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },
    title: {
        flex: 1,
        marginVertical: SIZES.spacing.md,
    },
    iconButtonRight: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: SIZES.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light_gray,
        paddingBottom: SIZES.spacing.xs,
    },
    textValue: {
        fontWeight: "bold",
        maxWidth: "75%",
    },
});

export default MarkerInfo;
