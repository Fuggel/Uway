import React, { createContext, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import Mapbox, { Location } from "@rnmapbox/maps";

import { THRESHOLD } from "@/constants/env-constants";
import useLocationPermission from "@/hooks/useLocationPermissions";
import { SnapToRoute } from "@/lib/SnapToRoute";
import { mapNavigationSelectors } from "@/store/mapNavigation";

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
    const snapToRoute = useRef<SnapToRoute | null>(null);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const directions = useSelector(mapNavigationSelectors.directions);
    const [userLocation, setUserLocation] = useState<Location | null>(null);

    useEffect(() => {
        if (!isNavigationMode || !directions) return;

        snapToRoute.current = new SnapToRoute({
            snapRadius: THRESHOLD.NAVIGATION.SNAP_RADIUS_IN_METERS,
            minAccuracy: THRESHOLD.NAVIGATION.MIN_ACCURACY,
        });

        return () => {
            snapToRoute.current = null;
        };
    }, [isNavigationMode, directions]);

    const updateUserLocation = useCallback(
        (location: Location) => {
            let updatedLocation = location;

            if (snapToRoute.current && directions) {
                updatedLocation =
                    snapToRoute.current.processLocation(location, directions.geometry.coordinates) || location;
            }

            setUserLocation(updatedLocation);
        },
        [directions]
    );

    useEffect(() => {
        if (!hasLocationPermissions) return;

        Mapbox.locationManager.start();
        Mapbox.locationManager.addListener(updateUserLocation);

        return () => {
            Mapbox.locationManager.removeListener(updateUserLocation);
            Mapbox.locationManager.stop();
        };
    }, [hasLocationPermissions, updateUserLocation]);

    return <UserLocationContext.Provider value={{ userLocation }}>{children}</UserLocationContext.Provider>;
};
