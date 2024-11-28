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

    useEffect(() => {
        if (!hasLocationPermissions) {
            return;
        }

        Mapbox.locationManager.start();

        Mapbox.locationManager.setMinDisplacement(3);
        Mapbox.locationManager.addListener((location: Location) => {
            setUserLocation(location);
        });

        return () => {
            Mapbox.locationManager.stop();
        };
    }, [hasLocationPermissions]);

    return <UserLocationContext.Provider value={{ userLocation }}>{children}</UserLocationContext.Provider>;
};
