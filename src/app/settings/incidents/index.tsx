import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import {
    PLAY_ACOUSTIC_WARNING_INCIDENT_THRESHOLD_IN_METERS,
    SHOW_INCIDENT_WARNING_THRESHOLD_IN_METERS,
} from "@/constants/map-constants";
import { SIZES } from "@/constants/size-constants";
import { mapIncidentActions, mapIncidentSelectors } from "@/store/mapIncident";
import { mapTextToSpeechSelectors } from "@/store/mapTextToSpeech";

import Input from "@/components/common/Input";
import Switch from "@/components/common/Switch";
import { SettingsItem } from "@/components/settings/SettingsItem";

const IncidentsSettings = () => {
    const dispatch = useDispatch();
    const showIncidents = useSelector(mapIncidentSelectors.showIncident);
    const playAcousticWarning = useSelector(mapIncidentSelectors.playAcousticWarning);
    const showWarningThresholdInMeters =
        useSelector(mapIncidentSelectors.showWarningThresholdInMeters) || SHOW_INCIDENT_WARNING_THRESHOLD_IN_METERS;
    const playAcousticWarningThresholdInMeters =
        useSelector(mapIncidentSelectors.playAcousticWarningThresholdInMeters) ||
        PLAY_ACOUSTIC_WARNING_INCIDENT_THRESHOLD_IN_METERS;
    const allowTextToSpeech = useSelector(mapTextToSpeechSelectors.selectAllowTextToSpeech);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView style={styles.container}>
                <SettingsItem title="Verkehrsdaten zeigen">
                    <Switch
                        checked={showIncidents}
                        onChange={() => dispatch(mapIncidentActions.setShowIncident(!showIncidents))}
                    />
                </SettingsItem>
                <SettingsItem title="Akustische Warnung">
                    <Switch
                        checked={allowTextToSpeech && playAcousticWarning}
                        disabled={!allowTextToSpeech}
                        onChange={() => dispatch(mapIncidentActions.setPlayAcousticWarning(!playAcousticWarning))}
                    />
                </SettingsItem>
                <SettingsItem title="Warnung anzeigen in Metern">
                    <Input
                        value={String(showWarningThresholdInMeters)}
                        onBlur={(val) => dispatch(mapIncidentActions.setShowWarningThresholdInMeters(Number(val)))}
                        type="numeric"
                    />
                </SettingsItem>
                <SettingsItem title="Akustische Warnung in Metern">
                    <Input
                        value={String(playAcousticWarningThresholdInMeters)}
                        onBlur={(val) =>
                            dispatch(mapIncidentActions.setPlayAcousticWarningThresholdInMeters(Number(val)))
                        }
                        type="numeric"
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
        zIndex: 999999,
    },
});

export default IncidentsSettings;
