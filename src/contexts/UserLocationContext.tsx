import * as Location from "expo-location";
import { createContext, useEffect, useState } from "react";

interface ContextProps {
    userLocation: Location.LocationObject | null;
    userHeading: number | null;
}

interface ProviderProps {
    children: React.ReactNode;
}

export const UserLocationContext = createContext<ContextProps>({
    userLocation: null,
    userHeading: null,
});

export const UserLocationContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
    const [userHeading, setUserHeading] = useState<number | null>(null);

    useEffect(() => {
        let locationSubscription: Location.LocationSubscription | null = null;

        const checkLocationPermission = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            await Location.watchHeadingAsync((heading) => {
                if (heading.trueHeading !== null && heading.accuracy >= 1) {
                    setUserHeading(heading.trueHeading);
                }
            });

            if (status === Location.PermissionStatus.GRANTED) {
                locationSubscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.BestForNavigation,
                        timeInterval: 1000,
                        distanceInterval: 1,
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

    return (
        <UserLocationContext.Provider value={{ userLocation, userHeading }}>{children}</UserLocationContext.Provider>
    );
};
