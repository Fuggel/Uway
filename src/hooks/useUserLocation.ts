import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { simulateUserLocation } from "../utils/route-testing-utils";
import { useSelector } from "react-redux";
import { mapTestingSelectors } from "../store/mapTesting";

export default function useUserLocation() {
    const simulateRoute = useSelector(mapTestingSelectors.simulateRoute);
    const selectedRoute = useSelector(mapTestingSelectors.selectedRoute);
    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
    const [userHeading, setUserHeading] = useState<number | null>(null);

    useEffect(() => {
        let locationSubscription: Location.LocationSubscription | null = null;
        let intervalId: NodeJS.Timeout | null = null;

        const startSimulation = () => {
            const simulateLocation = simulateUserLocation(selectedRoute);
            intervalId = setInterval(() => {
                simulateLocation({ setUserLocation, userHeading: userHeading ?? 0 });
            }, 1500);
        };

        const cancelSimulation = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        };

        const checkLocationPermission = async () => {
            if (process.env.NODE_ENV === "development" && simulateRoute && selectedRoute) {
                startSimulation();
            } else {
                cancelSimulation();
                const { status } = await Location.requestForegroundPermissionsAsync();
                await Location.watchHeadingAsync(
                    (heading) => {
                        if (heading.trueHeading !== null && heading.accuracy >= 1) {
                            setUserHeading(heading.trueHeading);
                        }
                    },
                );

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
            }
        };

        checkLocationPermission();

        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [simulateRoute, selectedRoute]);

    return { userLocation, userHeading };
}