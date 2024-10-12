import * as Location from "expo-location";
import { useEffect, useState } from "react";

const useLocationPermission = () => {
    const [hasLocationPermissions, setHasLocationPermissions] = useState(false);

    useEffect(() => {
        checkAndRequestLocationPermission();
    }, []);

    const checkAndRequestLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === Location.PermissionStatus.GRANTED) {
            setHasLocationPermissions(true);
        } else {
            setHasLocationPermissions(false);
        }
    };

    return { hasLocationPermissions };
};

export default useLocationPermission;
