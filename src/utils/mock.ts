import * as Location from "expo-location";

const route = [
    { latitude: 53.550273, longitude: 9.935628 },
    { latitude: 53.549750, longitude: 9.940000 },
    { latitude: 53.548800, longitude: 9.945000 },
    { latitude: 53.547500, longitude: 9.950000 },
    { latitude: 53.546800, longitude: 9.955000 },
    { latitude: 53.546300, longitude: 9.960000 },
    { latitude: 53.545800, longitude: 9.965000 },
    { latitude: 53.545500, longitude: 9.970000 },
    { latitude: 53.545200, longitude: 9.975000 },
    { latitude: 53.545002, longitude: 9.984089 }, // Hafencity
];

export function mockUserLocation(setUserLocation: React.Dispatch<React.SetStateAction<Location.LocationObject | null>>) {
    let index = 0;
    let direction = 1;

    setInterval(() => {
        setUserLocation({
            coords: {
                latitude: route[index].latitude,
                longitude: route[index].longitude,
                altitude: 0,
                accuracy: 0,
                heading: 0,
                speed: 0,
                altitudeAccuracy: 0,
            },
            timestamp: Date.now(),
        });

        index += direction;

        if (index === route.length - 1 || index === 0) {
            direction *= -1;
        }
    }, 1000);
}