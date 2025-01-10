import { useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { SIZES } from "@/constants/size-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { mapNavigationActions } from "@/store/mapNavigation";
import { mapSearchActions, mapSearchSelectors } from "@/store/mapSearch";
import { distanceToPointText } from "@/utils/map-utils";

import Swipable from "../../common/Swipable";
import Text from "../../common/Text";
import NoResults from "../../ui/NoResults";

interface RecentSearchesProps {
    handleLocationComplete: () => void;
}

const RecentSearches = ({ handleLocationComplete }: RecentSearchesProps) => {
    const dispatch = useDispatch();
    const { userLocation } = useContext(UserLocationContext);
    const recentSearches = useSelector(mapSearchSelectors.recentSearches);

    const longitude = userLocation?.coords.longitude as number;
    const latitude = userLocation?.coords.latitude as number;

    return (
        <View style={styles.suggestions}>
            {recentSearches.length > 0 ? (
                recentSearches.map((location) => (
                    <Swipable
                        key={location.default_id}
                        actionProps={{
                            text: "Löschen",
                            onPress: () => dispatch(mapSearchActions.deleteRecentSearch(location.default_id)),
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                dispatch(mapNavigationActions.setLocation(location));
                                handleLocationComplete();
                            }}
                        >
                            <View style={styles.suggestionItem}>
                                <View style={styles.suggestionPlace}>
                                    <MaterialCommunityIcons name="history" size={24} color="black" />
                                    <View style={styles.locationItem}>
                                        <Text style={{ fontWeight: "bold" }}>{location.name}</Text>
                                        {location.place_formatted && (
                                            <Text type="gray" textStyle="caption">
                                                {location.place_formatted}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                <Text type="gray" textStyle="caption">
                                    {distanceToPointText({
                                        pos1: [longitude, latitude],
                                        pos2: [location?.coordinates?.longitude, location?.coordinates?.latitude],
                                    })}
                                </Text>
                            </View>
                            <Divider />
                        </TouchableOpacity>
                    </Swipable>
                ))
            ) : (
                <NoResults text="Keine letzten Suchen." />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    suggestions: {
        paddingVertical: SIZES.spacing.sm,
        marginTop: 2,
        borderRadius: SIZES.borderRadius.sm,
    },
    locationItem: {
        width: "70%",
    },
    suggestionPlace: {
        flexDirection: "row",
        alignItems: "center",
        gap: SIZES.spacing.xs,
    },
    suggestionItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        paddingVertical: SIZES.spacing.xs,
        paddingRight: SIZES.spacing.md,
        paddingLeft: SIZES.spacing.sm,
    },
});

export default RecentSearches;
