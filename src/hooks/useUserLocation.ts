import { useEffect, useState } from "react";
import * as Location from "expo-location";

export default function useUserLocation() {
    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

    useEffect(() => {
        let locationSubscription: Location.LocationSubscription | null = null;

        const checkLocationPermission = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status === Location.PermissionStatus.GRANTED) {
                locationSubscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.BestForNavigation,
                    },
                    (location) => {
                        setUserLocation(location);
                    }
                );
            } else {
                setUserLocation(null);
            }
        };

        checkLocationPermission();

        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, []);

    return { userLocation };
}