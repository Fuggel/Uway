import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { mockUserLocation } from "../utils/mock-utils";

export default function useUserLocation({ mockMode = false }: { mockMode?: boolean; }) {
    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

    useEffect(() => {
        let locationSubscription: Location.LocationSubscription | null = null;

        const checkLocationPermission = async () => {
            if (mockMode) {
                mockUserLocation({ setUserLocation });
            } else {
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
            }
        };

        checkLocationPermission();

        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, [mockMode]);

    return { userLocation };
}