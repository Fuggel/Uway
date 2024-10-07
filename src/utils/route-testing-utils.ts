import { LocationObject } from "expo-location";

import { TESTING_ROUTES } from "@/constants/route-testing-constants";

export function simulateUserLocation(selectedRouteValue: string) {
    const selectedRoute = TESTING_ROUTES.find((route) => route.value === selectedRouteValue);

    if (!selectedRoute) {
        throw new Error(`Route with value ${selectedRouteValue} not found`);
    }

    let currentPosition = 0;
    const totalPoints = selectedRoute.coordinates.length;

    return function (params: { setUserLocation: (location: LocationObject) => void; userHeading: number }) {
        if (currentPosition < totalPoints) {
            params.setUserLocation({
                coords: {
                    longitude: selectedRoute.coordinates[currentPosition][0],
                    latitude: selectedRoute.coordinates[currentPosition][1],
                    speed: Math.floor(Math.random() * 90) + 10,
                    heading: params.userHeading,
                    accuracy: 5,
                    altitude: 0,
                    altitudeAccuracy: 0,
                },
                timestamp: Date.now(),
            });
            currentPosition++;
        } else {
            const lastCoordinate = selectedRoute.coordinates[totalPoints - 1];
            params.setUserLocation({
                coords: {
                    longitude: lastCoordinate[0],
                    latitude: lastCoordinate[1],
                    speed: 0,
                    heading: params.userHeading,
                    accuracy: 5,
                    altitude: 0,
                    altitudeAccuracy: 0,
                },
                timestamp: Date.now(),
            });
        }
    };
}
