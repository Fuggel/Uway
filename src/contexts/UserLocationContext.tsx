import React, { createContext, useEffect, useState } from "react";

import Mapbox, { Location } from "@rnmapbox/maps";

import useLocationPermission from "@/hooks/useLocationPermissions";

interface ContextProps {
    userLocation: Location | null;
}

interface ProviderProps {
    children: React.ReactNode;
}

export const UserLocationContext = createContext<ContextProps>({
    userLocation: null,
});

export const UserLocationContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const { hasLocationPermissions } = useLocationPermission();
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [lastLocations, setLastLocations] = useState<Location[]>([]);

    const smoothLocation = (newLocation: Location) => {
        const maxHistory = 5;
        const updatedLocations = [...lastLocations, newLocation].slice(-maxHistory);

        const avgLat = updatedLocations.reduce((sum, loc) => sum + loc.coords.latitude, 0) / updatedLocations.length;
        const avgLng = updatedLocations.reduce((sum, loc) => sum + loc.coords.longitude, 0) / updatedLocations.length;

        setLastLocations(updatedLocations);

        return {
            ...newLocation,
            coords: { ...newLocation.coords, latitude: avgLat, longitude: avgLng },
        };
    };

    useEffect(() => {
        if (!hasLocationPermissions) {
            return;
        }

        Mapbox.locationManager.start();

        Mapbox.locationManager.setMinDisplacement(3);
        Mapbox.locationManager.addListener((location: Location) => {
            const smoothedLocation = smoothLocation(location);
            setUserLocation(smoothedLocation);
        });

        return () => {
            Mapbox.locationManager.stop();
        };
    }, [hasLocationPermissions]);

    return <UserLocationContext.Provider value={{ userLocation }}>{children}</UserLocationContext.Provider>;
};
