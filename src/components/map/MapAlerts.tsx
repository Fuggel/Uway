import { SpeedLimitFeature } from "@/src/types/ISpeed";
import { determineIncidentIcon, determineSpeedLimitIcon } from "@/src/utils/map-utils";
import { Image, StyleSheet, Text, View } from "react-native";
import Toast from "../common/Toast";
import useSpeedCameras from "@/src/hooks/useSpeedCameras";
import useSpeedLimits from "@/src/hooks/useSpeedLimits";
import useIncidents from "@/src/hooks/useIncidents";
import { useContext } from "react";
import { UserLocationContext } from "@/src/contexts/UserLocationContext";
import { COLORS } from "@/src/constants/colors-constants";
import { SIZES } from "@/src/constants/size-constants";

export default function MapAlerts() {
    const { userLocation } = useContext(UserLocationContext);
    const { speedCameras } = useSpeedCameras();
    const { speedLimits } = useSpeedLimits();
    const { incidents } = useIncidents();

    const userSpeed = userLocation?.coords?.speed;
    const currentSpeed = userSpeed && userSpeed > 0 ? (userSpeed * 3.6).toFixed(1) : "0";

    return (
        <View style={styles.absoluteBottom}>
            {speedLimits?.alert && (
                <Image
                    source={determineSpeedLimitIcon(
                        (speedLimits.alert.feature.properties as SpeedLimitFeature).maxspeed
                    )}
                    style={styles.speedLimitImage}
                />
            )}

            {userLocation?.coords && (
                <Toast show type="info">
                    <Text style={styles.alertMsg}>{currentSpeed} km/h</Text>
                </Toast>
            )}

            {speedCameras?.alert && (
                <Toast
                    show={!!speedCameras.alert}
                    type="error"
                    title={`Blitzer in ${speedCameras.alert.distance.toFixed(0)} m`}
                />
            )}

            {incidents?.alert && (
                <Toast
                    show={!!incidents.alert}
                    type="error"
                    image={determineIncidentIcon(incidents.alert.events[0]?.iconCategory)}
                    title={`Achtung! Gefahr in ${incidents.alert.distance.toFixed(0)} m`}
                >
                    <Text style={styles.alertMsg}>{incidents.alert.events[0]?.description}</Text>
                </Toast>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    absoluteBottom: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        pointerEvents: "none",
    },
    alertMsg: {
        color: COLORS.dark,
        fontSize: SIZES.fontSize.md,
        fontWeight: "bold",
    },
    speedLimitImage: {
        width: 75,
        height: 75,
        marginBottom: SIZES.spacing.md,
        marginLeft: SIZES.spacing.sm,
    },
});
