import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapWaypointActions } from "@/store/mapWaypoint";
import { GasStation } from "@/types/IGasStation";
import { SearchLocation, SearchSuggestionProperties } from "@/types/ISearch";
import { MarkerSheet } from "@/types/ISheet";
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
    const categoryLocation = useSelector(mapNavigationSelectors.categoryLocation);
    const { sheetData, closeSheet } = useContext(BottomSheetContext);

    const navigateToGasStation = () => {
        const properties = sheetData?.markerProperties as GasStation;

        const street = properties.street;
        const houseNumber = properties.houseNumber || "";
        const postcode = properties.postCode || "";
        const city = properties.place || "";
        const country = "Deutschland";

        const newLocation: SearchLocation = {
            default_id: generateRandomId(),
            name: `${street} ${houseNumber}`,
            feature_type: "custom-waypoint",
            address: `${street} ${houseNumber}`,
            full_address: `${postcode} ${city}`,
            place_formatted: `${properties.brand}, ${postcode} ${city}, ${country}`,
            maki: "fuel",
            coordinates: {
                longitude: properties.lng,
                latitude: properties.lat,
            },
        };

        dispatch(mapNavigationActions.setLocation(newLocation));
        closeSheet();
    };

    const navigateToSearchCategory = () => {
        const properties = sheetData?.markerProperties as SearchSuggestionProperties;
        const full_address = properties.full_address;
        const name = properties.name;
        const place_formatted = properties.place_formatted;
        const maki = properties.maki;
        const feature_type = properties.feature_type;

        const newLocation: SearchLocation = {
            default_id: generateRandomId(),
            name,
            feature_type,
            address: full_address,
            full_address,
            place_formatted,
            maki,
            coordinates: {
                longitude: sheetData?.markerProperties.coordinates?.longitude,
                latitude: sheetData?.markerProperties.coordinates?.latitude,
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
                {(gasStation?.show || categoryLocation) && (
                    <View style={styles.iconButtonRight}>
                        {directions && gasStation?.show && (
                            <IconButton
                                icon="map-marker-plus"
                                size="md"
                                type="secondary"
                                onPress={waypointGasStation}
                            />
                        )}
                        {gasStation?.show && sheetData?.markerType === MarkerSheet.GAS_STATION && (
                            <IconButton icon="directions" size="md" type="secondary" onPress={navigateToGasStation} />
                        )}

                        {categoryLocation && sheetData?.markerType === MarkerSheet.CATEGORY_LOCATION && (
                            <IconButton
                                icon="directions"
                                size="md"
                                type="secondary"
                                onPress={navigateToSearchCategory}
                            />
                        )}
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
