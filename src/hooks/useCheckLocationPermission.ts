import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useInterval } from "usehooks-ts";

const TIME_INTERVAL = 1000 * 10;

export default function useCheckLocationPermission() {
    const [hasLocationPermission, setHasLocationPermission] = useState(false);

    const checkLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        setHasLocationPermission(status === "granted");
    };

    useEffect(() => {
        checkLocationPermission();
    }, []);

    useInterval(() => {
        checkLocationPermission();
    }, TIME_INTERVAL);

    return { hasLocationPermission };
}