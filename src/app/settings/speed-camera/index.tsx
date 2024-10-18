import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import {
    PLAY_ACOUSTIC_WARNING_SPEED_CAMERA_THRESHOLD_IN_METERS,
    SHOW_SPEED_CAMERA_WARNING_THRESHOLD_IN_METERS,
} from "@/constants/map-constants";
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
        SHOW_SPEED_CAMERA_WARNING_THRESHOLD_IN_METERS;
    const playAcousticWarningThresholdInMeters =
        useSelector(mapSpeedCameraSelectors.playAcousticWarningThresholdInMeters) ||
        PLAY_ACOUSTIC_WARNING_SPEED_CAMERA_THRESHOLD_IN_METERS;
    const allowTextToSpeech = useSelector(mapTextToSpeechSelectors.selectAllowTextToSpeech);

    return (
        <View style={styles.container}>
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
                    onChange={(val) => dispatch(mapSpeedCameraActions.setShowWarningThresholdInMeters(Number(val)))}
                    type="numeric"
                />
            </SettingsItem>
            <SettingsItem title="Akustische Warnung in Metern">
                <Input
                    value={String(playAcousticWarningThresholdInMeters)}
                    onChange={(val) =>
                        dispatch(mapSpeedCameraActions.setPlayAcousticWarningThresholdInMeters(Number(val)))
                    }
                    type="numeric"
                />
            </SettingsItem>
        </View>
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
