import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { mapNavigationActions } from "@/store/mapNavigation";
import { GasStation } from "@/types/IGasStation";
import { SearchLocation } from "@/types/ISearch";
import { generateRandomId } from "@/utils/auth-utils";

import IconButton from "@/components/common/IconButton";
import InfoRow from "@/components/common/InfoRow";
import Text from "@/components/common/Text";

interface GasStationInfoSheetProps {
    data: { label: string; value: string | number | React.ReactNode }[];
    title: string;
}

const GasStationInfoSheet = ({ data, title }: GasStationInfoSheetProps) => {
    const dispatch = useDispatch();
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
        dispatch(mapNavigationActions.setDirectNavigation(true));
        dispatch(mapNavigationActions.setIsNavigationMode(true));
        dispatch(mapNavigationActions.setTracking(true));
        dispatch(mapNavigationActions.setIsNavigationSelecting(false));
        dispatch(mapNavigationActions.setRouteOptions(null));
        dispatch(mapNavigationActions.setSelectedRoute(0));
        closeSheet();
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text textStyle="header" style={styles.title}>
                    {title || "Tankstelle"}
                </Text>
                <IconButton icon="directions" size="md" type="secondary" onPress={navigateToGasStation} />
            </View>

            {data?.map((item, index) => <InfoRow key={index} label={item.label} value={item.value} />)}
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
    value: {
        fontWeight: "bold",
        maxWidth: "75%",
    },
});

export default GasStationInfoSheet;
