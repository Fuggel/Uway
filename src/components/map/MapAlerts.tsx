import { useContext } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useIncidents from "@/hooks/useIncidents";
import useSpeedCameras from "@/hooks/useSpeedCameras";
import useSpeedLimits from "@/hooks/useSpeedLimits";
import { SpeedLimitFeature } from "@/types/ISpeed";
import { determineIncidentIcon, determineSpeedLimitIcon } from "@/utils/map-utils";

import Toast from "../common/Toast";

const MapAlerts = () => {
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
};

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

export default MapAlerts;
