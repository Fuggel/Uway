import { useEffect, useState } from "react";
import * as Location from "expo-location";

export default function useCheckLocationPermission() {
    const [hasLocationPermission, setHasLocationPermission] = useState(false);

    useEffect(() => {
        const checkLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            setHasLocationPermission(status === "granted");
        };

        const timeoutInterval = setTimeout(() => {
            checkLocationPermission();
        }, 60000);

        return () => clearInterval(timeoutInterval);
    }, []);

    return hasLocationPermission;
}