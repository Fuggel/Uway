import { useEffect, useState } from "react";
import * as Location from "expo-location";

export default function useUserLocation() {
    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

    const checkLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        const location = await Location.getCurrentPositionAsync({});

        if (status === Location.PermissionStatus.GRANTED) {
            setUserLocation(location);
        } else {
            setUserLocation(null);
        }
    };

    useEffect(() => {
        checkLocationPermission();
    }, [userLocation]);

    return { userLocation };
}