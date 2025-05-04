import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { useDispatch } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { mapNavigationActions } from "@/store/mapNavigation";
import { GasStation } from "@/types/IGasStation";
import { SearchLocation } from "@/types/ISearch";
import { generateRandomId } from "@/utils/auth-utils";
import { getGasStationIcon } from "@/utils/map-utils";
import { gasStationTitle } from "@/utils/sheet-utils";

import InfoSheet from "@/components/common/InfoSheet";
import Text from "@/components/common/Text";
import PriceDisplay from "@/components/ui/PriceDisplay";

const GasStationInfoSheet = () => {
    const dispatch = useDispatch();
    const { sheetData, closeSheet } = useContext(BottomSheetContext);
    const { street, houseNumber, postCode, place, brand, lng, lat, diesel, e5, e10, iconType } =
        (sheetData?.markerProperties as GasStation) ?? {};

    const navigateToGasStation = () => {
        const newLocation: SearchLocation = {
            default_id: generateRandomId(),
            name: `${street} ${houseNumber ?? ""}`,
            feature_type: "custom-waypoint",
            address: `${street} ${houseNumber}`,
            full_address: `${postCode ?? ""} ${place ?? ""}`,
            place_formatted: `${brand ?? ""}, ${postCode ?? ""} ${place ?? ""}, Deutschland`,
            maki: "fuel",
            coordinates: { longitude: lng, latitude: lat },
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
        <InfoSheet
            title={gasStationTitle(sheetData?.markerProperties)}
            subtitle={`${street} ${houseNumber}`}
            img={getGasStationIcon(iconType)}
        >
            <View style={styles.content}>
                <View style={styles.pricesWrapper}>
                    <View style={styles.fuelPrice}>
                        <Text type="lightGray">Diesel</Text>
                        <PriceDisplay price={diesel} st={{ color: COLORS.white }} stSub={{ color: COLORS.white }} />
                    </View>

                    <View style={styles.fuelPrice}>
                        <Text type="lightGray">E5</Text>
                        <PriceDisplay price={e5} st={{ color: COLORS.white }} stSub={{ color: COLORS.white }} />
                    </View>

                    <View style={styles.fuelPrice}>
                        <Text type="lightGray">E10</Text>
                        <PriceDisplay price={e10} st={{ color: COLORS.white }} stSub={{ color: COLORS.white }} />
                    </View>
                </View>

                <Button
                    mode="contained"
                    onPress={navigateToGasStation}
                    style={styles.button}
                    labelStyle={styles.buttonText}
                >
                    Navigation starten
                </Button>
            </View>
        </InfoSheet>
    );
};

export default GasStationInfoSheet;

const styles = StyleSheet.create({
    content: {
        gap: SIZES.spacing.md,
    },
    pricesWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: SIZES.spacing.md,
    },
    fuelPrice: {
        backgroundColor: COLORS.dark_gray,
        borderRadius: SIZES.borderRadius.sm,
        padding: SIZES.spacing.md,
    },
    button: {
        backgroundColor: COLORS.secondary,
        borderRadius: SIZES.borderRadius.sm,
        height: 50,
        justifyContent: "center",
    },
    buttonText: {
        color: COLORS.white,
        fontSize: SIZES.fontSize.md,
    },
});
