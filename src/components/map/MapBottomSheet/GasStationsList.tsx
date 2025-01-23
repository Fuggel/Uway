import { useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { MapFeatureContext } from "@/contexts/MapFeatureContext";
import { mapNavigationActions, mapNavigationSelectors } from "@/store/mapNavigation";
import { mapWaypointActions } from "@/store/mapWaypoint";
import { GasStation } from "@/types/IGasStation";
import { SearchLocation } from "@/types/ISearch";
import { generateRandomId } from "@/utils/auth-utils";
import { getOrderedGasStations } from "@/utils/map-utils";

import IconButton from "@/components/common/IconButton";
import Text from "@/components/common/Text";
import PriceDisplay from "@/components/ui/PriceDisplay";

const GasStationsList = () => {
    const dispatch = useDispatch();
    const { closeSheet } = useContext(BottomSheetContext);
    const { gasStations } = useContext(MapFeatureContext);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);

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
        closeSheet();
    };

    const waypointGasStation = (gasStationProperties: GasStation | undefined) => {
        if (!gasStationProperties) return;

        dispatch(
            mapWaypointActions.setGasStationWaypoints({
                lon: gasStationProperties.lng,
                lat: gasStationProperties.lat,
            })
        );
        closeSheet();
    };

    if (!data) return null;

    return (
        <View style={styles.container}>
            {data?.map((item, i) => {
                const station = gasStationData(item);

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

                            <View style={styles.priceTable}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableHeader}>Diesel</Text>
                                    <Text style={styles.tableHeader}>E5</Text>
                                    <Text style={styles.tableHeader}>E10</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCell}>
                                        {station.diesel ? (
                                            <PriceDisplay
                                                price={station.diesel}
                                                st={styles.tableCell}
                                                stSub={styles.tableCellSub}
                                            />
                                        ) : (
                                            "-"
                                        )}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {station.e5 ? (
                                            <PriceDisplay
                                                price={station.e5}
                                                st={styles.tableCell}
                                                stSub={styles.tableCellSub}
                                            />
                                        ) : (
                                            "-"
                                        )}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {station.e10 ? (
                                            <PriceDisplay
                                                price={station.e10}
                                                st={styles.tableCell}
                                                stSub={styles.tableCellSub}
                                            />
                                        ) : (
                                            "-"
                                        )}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <IconButton
                            icon="directions"
                            size="md"
                            type="secondary"
                            onPress={() => navigateToGasStation(item)}
                        />

                        {isNavigationMode && (
                            <IconButton
                                icon="location"
                                size="md"
                                type="secondary"
                                onPress={() => waypointGasStation(item)}
                            />
                        )}
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
    priceTable: {
        marginVertical: SIZES.spacing.xs,
        borderColor: COLORS.secondary,
        borderWidth: 1,
        borderRadius: SIZES.borderRadius.md,
        padding: SIZES.spacing.xs,
    },
    tableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: SIZES.spacing.xs,
    },
    tableHeader: {
        flex: 1,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: SIZES.spacing.xxs,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.primary,
        fontSize: SIZES.fontSize.sm,
        color: COLORS.primary,
    },
    tableCell: {
        textAlign: "center",
        color: COLORS.primary,
        fontSize: SIZES.fontSize.sm,
        fontWeight: "normal",
        marginRight: 1.5,
    },
    tableCellSub: {
        fontSize: SIZES.fontSize.xs,
        color: COLORS.primary,
        fontWeight: "normal",
    },
});

export default GasStationsList;
