import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";

const usePermissions = () => {
    const [hasLocationPermissions, setHasLocationPermissions] = useState(false);
    const [hasNotificationPermissions, setHasNotificationPermissions] = useState(false);

    useEffect(() => {
        checkAndRequestLocationPermission();
        checkAndRequestNotificationPermission();
    }, []);

    const checkAndRequestLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setHasLocationPermissions(status === Location.PermissionStatus.GRANTED);
    };

    const checkAndRequestNotificationPermission = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        setHasNotificationPermissions(status === "granted");
    };

    return {
        hasLocationPermissions,
        hasNotificationPermissions,
    };
};

export default usePermissions;
