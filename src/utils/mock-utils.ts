import { LocationObject } from "expo-location";
import { LonLat } from "../types/IMap";

export function generateRandomCoordinates(params: {
    lonLat: LonLat,
    distanceRange: { min: number, max: number; },
    numPoints: number;
}) {
    const points = [];
    const earthRadius = 6371000;
    const toRad = (deg: number) => deg * (Math.PI / 180);
    const toDeg = (rad: number) => rad * (180 / Math.PI);

    let currentLat = params.lonLat.lat;
    let currentLon = params.lonLat.lon;

    for (let i = 0; i < params.numPoints; i++) {
        const distance = Math.random() * (params.distanceRange.max - params.distanceRange.min) + params.distanceRange.min;
        const angle = Math.random() * 360;

        const deltaLat = toDeg(distance / earthRadius);
        const deltaLon = toDeg(distance / (earthRadius * Math.cos(toRad(currentLat))));

        const newLat = currentLat + deltaLat * Math.cos(toRad(angle));
        const newLon = currentLon + deltaLon * Math.sin(toRad(angle));

        points.push({ latitude: newLat, longitude: newLon });
        currentLat = newLat;
        currentLon = newLon;
    }

    return points;
}

const mockLocations = generateRandomCoordinates({
    lonLat: { lat: 53.54839604442992, lon: 9.932443474070425 },
    distanceRange: { min: 5, max: 10 },
    numPoints: 10,
});

export function mockUserLocation(params: {
    setUserLocation: (location: LocationObject) => void;
}) {
    let mockIndex = 0;

    const intervalId = setInterval(() => {
        if (mockIndex < mockLocations.length) {
            params.setUserLocation({
                coords: {
                    latitude: mockLocations[mockIndex].latitude,
                    longitude: mockLocations[mockIndex].longitude,
                    speed: Math.floor(Math.random() * 90) + 10,
                    heading: Math.floor(Math.random() * 10),
                    accuracy: 5,
                    altitude: 0,
                    altitudeAccuracy: 0,
                },
                timestamp: Date.now(),
            });
            mockIndex++;
        } else {
            mockIndex = 0;
        }
    }, 1000);

    return () => clearInterval(intervalId);
}