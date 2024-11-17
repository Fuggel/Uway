import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { THRESHOLD } from "@/constants/env-constants";
import { SIZES } from "@/constants/size-constants";
import { mapSpeedCameraActions, mapSpeedCameraSelectors } from "@/store/mapSpeedCamera";
import { mapTextToSpeechSelectors } from "@/store/mapTextToSpeech";

import Input from "@/components/common/Input";
import Switch from "@/components/common/Switch";
import { SettingsItem } from "@/components/settings/SettingsItem";

const SpeedCameraSettings = () => {
    const dispatch = useDispatch();
    const showSpeedCameras = useSelector(mapSpeedCameraSelectors.showSpeedCameras);
    const playAcousticWarning = useSelector(mapSpeedCameraSelectors.playAcousticWarning);
    const showWarningThresholdInMeters =
        useSelector(mapSpeedCameraSelectors.showWarningThresholdInMeters) ||
        THRESHOLD.SPEED_CAMERA.SHOW_WARNING_IN_METERS;
    const playAcousticWarningThresholdInMeters =
        useSelector(mapSpeedCameraSelectors.playAcousticWarningThresholdInMeters) ||
        THRESHOLD.SPEED_CAMERA.PLAY_ACOUSTIC_WARNING_IN_METERS;
    const allowTextToSpeech = useSelector(mapTextToSpeechSelectors.selectAllowTextToSpeech);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView style={styles.container}>
                <SettingsItem title="Blitzer zeigen">
                    <Switch
                        checked={showSpeedCameras}
                        onChange={() => dispatch(mapSpeedCameraActions.setShowSpeedCameras(!showSpeedCameras))}
                    />
                </SettingsItem>
                <SettingsItem title="Akustische Warnung">
                    <Switch
                        checked={allowTextToSpeech && playAcousticWarning}
                        disabled={!allowTextToSpeech}
                        onChange={() => dispatch(mapSpeedCameraActions.setPlayAcousticWarning(!playAcousticWarning))}
                    />
                </SettingsItem>
                <SettingsItem title="Warnung anzeigen in Metern">
                    <Input
                        value={String(showWarningThresholdInMeters)}
                        onBlur={(val) => dispatch(mapSpeedCameraActions.setShowWarningThresholdInMeters(Number(val)))}
                        type="numeric"
                    />
                </SettingsItem>
                <SettingsItem title="Akustische Warnung in Metern">
                    <Input
                        value={String(playAcousticWarningThresholdInMeters)}
                        onBlur={(val) =>
                            dispatch(mapSpeedCameraActions.setPlayAcousticWarningThresholdInMeters(Number(val)))
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

export default SpeedCameraSettings;
