import React, { createContext, useEffect, useState } from "react";

import Mapbox, { Location } from "@rnmapbox/maps";

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
    const [userLocation, setUserLocation] = useState<Location | null>(null);

    useEffect(() => {
        Mapbox.locationManager.start();

        Mapbox.locationManager.addListener((location: Location) => {
            setUserLocation(location);
        });

        return () => {
            Mapbox.locationManager.stop();
        };
    }, []);

    return <UserLocationContext.Provider value={{ userLocation }}>{children}</UserLocationContext.Provider>;
};
