import { ScrollView, StyleSheet, View } from "react-native";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { SearchLocation, SearchSuggestionProperties } from "@/types/ISearch";
import { generateRandomId } from "@/utils/auth-utils";

import IconButton from "@/components/common/IconButton";
import Text from "@/components/common/Text";

interface PoiListProps {
    data: SearchSuggestionProperties[] | undefined;
    onSelect: (newLocation: SearchLocation) => void;
}

const PoiList = ({ data, onSelect }: PoiListProps) => {
    const getNewLocation = (properties: SearchSuggestionProperties) => {
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
                longitude: properties.coordinates?.longitude,
                latitude: properties.coordinates?.latitude,
            },
        };

        return newLocation;
    };

    return (
        <View style={styles.container}>
            {data?.map((item, i) => {
                const newLocation = getNewLocation(item);

                return (
                    <ScrollView key={i} style={styles.itemContainer} contentContainerStyle={styles.contentContainer}>
                        <View style={{ width: "80%" }}>
                            <Text style={styles.textHeader}>{item.name}</Text>
                            <Text style={styles.textBody}>{item.full_address}</Text>
                            <Text style={styles.textBody}>{item.distance}</Text>
                        </View>

                        <IconButton
                            icon="directions"
                            size="md"
                            type="secondary"
                            onPress={() => onSelect(newLocation)}
                        />
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
        paddingVertical: SIZES.spacing.md,
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

export default PoiList;
