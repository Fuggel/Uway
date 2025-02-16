import React, { createContext, useEffect, useMemo, useState } from "react";
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
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const directions = useSelector(mapNavigationSelectors.directions);

    const snapToRoute = useMemo(() => {
        if (isNavigationMode && directions) {
            return new SnapToRoute({
                snapRadius: THRESHOLD.NAVIGATION.SNAP_RADIUS_IN_METERS,
                maxSpeedThreshold: THRESHOLD.NAVIGATION.MAX_SPEED_THRESHOLD_IN_M_PER_S,
                minAccuracy: THRESHOLD.NAVIGATION.MIN_ACCURACY,
            });
        }

        return null;
    }, [isNavigationMode, directions]);

    useEffect(() => {
        if (!hasLocationPermissions) {
            return;
        }

        Mapbox.locationManager.start();
        Mapbox.locationManager.setMinDisplacement(3);

        Mapbox.locationManager.addListener((location: Location) => {
            let updatedLocation = location;

            if (snapToRoute && directions) {
                updatedLocation = snapToRoute.processLocation(location, directions.geometry.coordinates) || location;
            }

            setUserLocation(updatedLocation);
        });

        return () => {
            Mapbox.locationManager.stop();
        };
    }, [hasLocationPermissions, snapToRoute]);

    return <UserLocationContext.Provider value={{ userLocation }}>{children}</UserLocationContext.Provider>;
};
