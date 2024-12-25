import { ScrollView, StyleSheet, View } from "react-native";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { GasStation } from "@/types/IGasStation";
import { LonLat } from "@/types/IMap";

import IconButton from "../common/IconButton";
import Text from "../common/Text";

interface MapWaypointInfoProps {
    data: GasStation[] | undefined;
    onSelect: (coords: LonLat) => void;
}

const MapWaypointInfo = ({ data, onSelect }: MapWaypointInfoProps) => {
    return (
        <View style={styles.container}>
            {data?.map((item, i) => (
                <ScrollView
                    key={i}
                    style={styles.itemContainer}
                    contentContainerStyle={{ alignItems: "center", justifyContent: "space-between" }}
                >
                    <Text>{item.name}</Text>
                    <Text>{item.brand}</Text>
                    <Text>{item.street}</Text>
                    <Text>{item.place}</Text>
                    <Text>Dist in KM: {item.dist}</Text>
                    <Text>{item.diesel}</Text>
                    <Text>{item.e5}</Text>
                    <Text>{item.e10}</Text>
                    <Text>{item.isOpen}</Text>
                    <Text>{item.houseNumber}</Text>
                    <Text>{item.postCode}</Text>

                    <IconButton
                        icon="map-marker-plus"
                        size="lg"
                        type="secondary"
                        onPress={() => onSelect({ lon: item.lng, lat: item.lat })}
                    />
                </ScrollView>
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
    itemContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: SIZES.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light_gray,
        paddingBottom: SIZES.spacing.xs,
    },
});

export default MapWaypointInfo;
