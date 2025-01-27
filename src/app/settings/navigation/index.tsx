import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { mapExcludeNavigationActions, mapExcludeNavigationSelectors } from "@/store/mapExcludeNavigation";
import { ExcludeType } from "@/types/INavigation";

import Switch from "@/components/common/Switch";
import { SettingsItem } from "@/components/settings/SettingsItem";

const NavigationSettings = () => {
    const dispatch = useDispatch();
    const excludeTypes = useSelector(mapExcludeNavigationSelectors.excludeTypes);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView style={styles.container}>
                <SettingsItem title="Mautstraßen meiden">
                    <Switch
                        checked={excludeTypes.toll}
                        onChange={() =>
                            dispatch(
                                mapExcludeNavigationActions.setExcludeTypes({
                                    ...excludeTypes,
                                    [ExcludeType.TOLL]: !excludeTypes[ExcludeType.TOLL],
                                })
                            )
                        }
                    />
                </SettingsItem>
                <SettingsItem title="Autobahnen meiden">
                    <Switch
                        checked={excludeTypes.motorway}
                        onChange={() =>
                            dispatch(
                                mapExcludeNavigationActions.setExcludeTypes({
                                    ...excludeTypes,
                                    [ExcludeType.MOTORWAY]: !excludeTypes[ExcludeType.MOTORWAY],
                                })
                            )
                        }
                    />
                </SettingsItem>
                <SettingsItem title="Fähren meiden">
                    <Switch
                        checked={excludeTypes.ferry}
                        onChange={() =>
                            dispatch(
                                mapExcludeNavigationActions.setExcludeTypes({
                                    ...excludeTypes,
                                    [ExcludeType.FERRY]: !excludeTypes[ExcludeType.FERRY],
                                })
                            )
                        }
                    />
                </SettingsItem>
                <SettingsItem title="Unbefestigte Straßen meiden">
                    <Switch
                        checked={excludeTypes.unpaved}
                        onChange={() =>
                            dispatch(
                                mapExcludeNavigationActions.setExcludeTypes({
                                    ...excludeTypes,
                                    [ExcludeType.UNPAVED]: !excludeTypes[ExcludeType.UNPAVED],
                                })
                            )
                        }
                    />
                </SettingsItem>
                <SettingsItem title="Mautstraßen meiden (nur Bargeld)">
                    <Switch
                        checked={excludeTypes[ExcludeType.CASH_ONLY_TOLLS]}
                        onChange={() =>
                            dispatch(
                                mapExcludeNavigationActions.setExcludeTypes({
                                    ...excludeTypes,
                                    [ExcludeType.CASH_ONLY_TOLLS]: !excludeTypes[ExcludeType.CASH_ONLY_TOLLS],
                                })
                            )
                        }
                    />
                </SettingsItem>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.white,
        padding: SIZES.spacing.md,
    },
});

export default NavigationSettings;
