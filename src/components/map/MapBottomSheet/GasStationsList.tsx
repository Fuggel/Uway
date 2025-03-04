import { useContext, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { MapFeatureContext } from "@/contexts/MapFeatureContext";
import { mapNavigationActions } from "@/store/mapNavigation";
import { DefaultFilter, FuelType, GasStation } from "@/types/IGasStation";
import { SearchLocation } from "@/types/ISearch";
import { generateRandomId } from "@/utils/auth-utils";
import { getOrderedGasStations, getStationColor } from "@/utils/map-utils";

import Dropdown from "@/components/common/Dropdown";
import IconButton from "@/components/common/IconButton";
import Text from "@/components/common/Text";
import PriceDisplay from "@/components/ui/PriceDisplay";

const GasStationsList = () => {
    const dispatch = useDispatch();
    const { closeSheet } = useContext(BottomSheetContext);
    const { gasStations } = useContext(MapFeatureContext);
    const [selectedBrand, setSelectedBrand] = useState<string>(DefaultFilter.ALL);
    const [selectedFuelType, setSelectedFuelType] = useState<string>(FuelType.DIESEL);

    const data = getOrderedGasStations(
        gasStations.gasStations?.features.map((feature) => feature.properties as GasStation)
    );

    const gasStationData = (gasStationProperties: GasStation | undefined) => {
        const street = gasStationProperties?.street;
        const houseNumber = gasStationProperties?.houseNumber;
        const postCode = gasStationProperties?.postCode;
        const place = gasStationProperties?.place;

        const address = street
            ? `${street} ${houseNumber}, ${postCode} ${place}`
            : (gasStationProperties?.name ?? "Unbekannt");

        return {
            brand: gasStationProperties?.brand ?? "",
            street: address,
            dist: gasStationProperties?.dist ?? "",
            diesel: gasStationProperties?.diesel ? gasStationProperties.diesel : null,
            e5: gasStationProperties?.e5 ? gasStationProperties.e5 : null,
            e10: gasStationProperties?.e10 ? gasStationProperties.e10 : null,
            isOpen: gasStationProperties?.isOpen ? "Geöffnet" : "Geschlossen",
        };
    };

    const navigateToGasStation = (gasStationProperties: GasStation | undefined) => {
        if (!gasStationProperties) return;

        const street = gasStationProperties.street;
        const houseNumber = gasStationProperties.houseNumber || "";
        const postcode = gasStationProperties.postCode || "";
        const city = gasStationProperties.place || "";
        const country = "Deutschland";

        const newLocation: SearchLocation = {
            default_id: generateRandomId(),
            name: `${street} ${houseNumber}`,
            feature_type: "custom-waypoint",
            address: `${street} ${houseNumber}`,
            full_address: `${postcode} ${city}`,
            place_formatted: `${gasStationProperties.brand}, ${postcode} ${city}, ${country}`,
            maki: "fuel",
            coordinates: {
                longitude: gasStationProperties.lng,
                latitude: gasStationProperties.lat,
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

    if (!data) return null;

    const filteredData = data.filter((item) => {
        const fuelTypeMatches =
            selectedFuelType === DefaultFilter.ALL ||
            (selectedFuelType === FuelType.DIESEL && item.diesel > 0) ||
            (selectedFuelType === FuelType.E5 && item.e5 > 0) ||
            (selectedFuelType === FuelType.E10 && item.e10 > 0);

        const brandMatches = selectedBrand === DefaultFilter.ALL || item.brand === selectedBrand;

        return fuelTypeMatches && brandMatches;
    });

    const selectedPrice = (item: GasStation) => {
        switch (selectedFuelType) {
            case FuelType.DIESEL:
                return item.diesel;
            case FuelType.E5:
                return item.e5;
            case FuelType.E10:
                return item.e10;
            default:
                return item.diesel;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <Dropdown
                    clearable
                    icon="gas-station"
                    placeholder="Tankstelle"
                    data={[...new Set(data.map((item) => item.brand))]
                        .sort((a, b) => a.localeCompare(b))
                        .map((brand) => ({
                            label: brand,
                            value: brand,
                        }))}
                    value={selectedBrand}
                    onChange={(item: string) => setSelectedBrand(item)}
                />

                <Dropdown
                    icon="fuel"
                    placeholder="Kraftstoff"
                    data={[FuelType.DIESEL, FuelType.E5, FuelType.E10].map((fuelType) => ({
                        label: fuelType,
                        value: fuelType,
                    }))}
                    value={selectedFuelType}
                    onChange={(item: string) => setSelectedFuelType(item)}
                />
            </View>

            {filteredData?.map((item, i) => {
                const station = gasStationData(item);
                const priceColor = getStationColor(filteredData, selectedPrice(item), selectedFuelType as FuelType);

                return (
                    <ScrollView key={i} style={styles.itemContainer} contentContainerStyle={styles.contentContainer}>
                        <View>
                            <Text style={styles.textHeader}>{station.brand}</Text>
                            <Text style={styles.textBody}>{station.street}</Text>
                            <View style={{ flexDirection: "row" }}>
                                <Text
                                    style={{
                                        ...styles.textBody,
                                        color: station.isOpen === "Geöffnet" ? COLORS.success : COLORS.error,
                                    }}
                                >
                                    {station.isOpen}
                                </Text>
                                <Text style={styles.textBody}> · </Text>
                                <Text style={styles.textBody}>{station.dist} km</Text>
                            </View>
                        </View>

                        <View style={{ alignItems: "flex-end", justifyContent: "space-between" }}>
                            <PriceDisplay
                                price={selectedPrice(item)}
                                st={{ color: priceColor, fontSize: SIZES.fontSize.lg }}
                                stSub={{ color: priceColor, fontSize: SIZES.fontSize.md }}
                            />

                            <IconButton
                                icon="directions"
                                size="md"
                                type="secondary"
                                onPress={() => navigateToGasStation(item)}
                            />
                        </View>
                    </ScrollView>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: SIZES.spacing.md,
        paddingBottom: SIZES.spacing.md,
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: SIZES.spacing.md,
        marginVertical: SIZES.spacing.md,
    },
    itemContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: SIZES.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light_gray,
        paddingBottom: SIZES.spacing.xs,
    },
    contentContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: "100%",
    },
    textHeader: {
        fontWeight: "bold",
        marginBottom: SIZES.spacing.xxs,
    },
    textBody: {
        color: COLORS.gray,
        fontSize: SIZES.fontSize.sm,
    },
});

export default GasStationsList;
