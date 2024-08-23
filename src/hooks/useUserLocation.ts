import { useEffect, useState } from "react";
import * as Location from "expo-location";

export default function useUserLocation() {
    const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

    const checkLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setPermissionStatus(status);

        if (status === Location.PermissionStatus.GRANTED) {
            const location = await Location.getCurrentPositionAsync({});
            setUserLocation(location);
        } else {
            setUserLocation(null);
        }
    };

    useEffect(() => {
        checkLocationPermission();
    }, [permissionStatus]);

    return { userLocation };
}