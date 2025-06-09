import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

const usePermissions = () => {
    const [hasLocationPermissions, setHasLocationPermissions] = useState(false);
    const [hasNotificationPermissions, setHasNotificationPermissions] = useState(false);

    useEffect(() => {
        checkAndRequestLocationPermission();
        checkAndRequestNotificationPermission();
    }, []);

    const checkAndRequestLocationPermission = async () => {
        const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
        let backgroundGranted = false;

        if (fgStatus === Location.PermissionStatus.GRANTED) {
            const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
            backgroundGranted = bgStatus === Location.PermissionStatus.GRANTED;
        }

        setHasLocationPermissions(fgStatus === Location.PermissionStatus.GRANTED && backgroundGranted);
    };

    const checkAndRequestNotificationPermission = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        const expoGranted = status === "granted";

        let androidGranted = true;
        if (Platform.OS === "android" && Platform.Version >= 33) {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
            androidGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        }

        setHasNotificationPermissions(expoGranted && androidGranted);
    };

    return {
        hasLocationPermissions,
        hasNotificationPermissions,
    };
};

export default usePermissions;
