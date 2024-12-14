import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { mapSpeedCameraActions, mapSpeedCameraSelectors } from "@/store/mapSpeedCamera";
import { mapTextToSpeechSelectors } from "@/store/mapTextToSpeech";

import Switch from "@/components/common/Switch";
import { SettingsItem } from "@/components/settings/SettingsItem";

const SpeedCameraSettings = () => {
    const dispatch = useDispatch();
    const showSpeedCameras = useSelector(mapSpeedCameraSelectors.showSpeedCameras);
    const playAcousticWarning = useSelector(mapSpeedCameraSelectors.playAcousticWarning);
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
