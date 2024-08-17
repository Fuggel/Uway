import { useEffect, useState } from "react";
import * as Location from "expo-location";


const TIME_INTERVAL = 1000 * 10;

export default function useCheckLocationPermission() {
    const [hasLocationPermission, setHasLocationPermission] = useState(false);

    useEffect(() => {
        const checkLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            setHasLocationPermission(status === "granted");
        };

        const timeoutInterval = setInterval(() => {
            checkLocationPermission();
        }, TIME_INTERVAL);

        return () => clearInterval(timeoutInterval);
    }, []);

    return hasLocationPermission;
}