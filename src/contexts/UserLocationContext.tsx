import React, { createContext, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import Mapbox, { Location } from "@rnmapbox/maps";

import { THRESHOLD } from "@/constants/env-constants";
import usePermissions from "@/hooks/usePermissions";
import useTextToSpeech from "@/hooks/useTextToSpeech";
import { SnapToRoute } from "@/lib/SnapToRoute";
import { mapNavigationSelectors } from "@/store/mapNavigation";

interface ContextProps {
    userLocation: Location | null;
}

interface ProviderProps {
    children: React.ReactNode;
}

export const UserLocationContext = createContext<ContextProps>({ userLocation: null });

export const UserLocationContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const { hasLocationPermissions } = usePermissions();
    const { startSpeech } = useTextToSpeech();
    const snapToRoute = useRef<SnapToRoute | null>(null);
    const lastSpeechTime = useRef(0);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);
    const directions = useSelector(mapNavigationSelectors.directions);
    const [userLocation, setUserLocation] = useState<Location | null>(null);

    useEffect(() => {
        if (!isNavigationMode || !directions) return;

        snapToRoute.current = new SnapToRoute({
            snapRadius: THRESHOLD.NAVIGATION.SNAP_RADIUS_IN_METERS,
            minAccuracy: THRESHOLD.NAVIGATION.MIN_ACCURACY,
            maxSnapHeadingDifference: THRESHOLD.NAVIGATION.MAX_SNAP_HEADING_DIFFERENCE,
        });

        return () => {
            snapToRoute.current = null;
        };
    }, [isNavigationMode, directions]);

    const shouldSpeakWarning = () => {
        const now = Date.now();
        if (now - lastSpeechTime.current > THRESHOLD.NAVIGATION.SPEECH_COOLDOWN_IN_SECONDS) {
            lastSpeechTime.current = now;
            return true;
        }
        return false;
    };

    const updateUserLocation = useCallback(
        (location: Location) => {
            const { accuracy } = location.coords;
            let updatedLocation = location;

            if (snapToRoute.current && directions) {
                updatedLocation =
                    snapToRoute.current.processLocation(location, directions.geometry.coordinates) || location;
            }

            if (shouldSpeakWarning() && (!accuracy || accuracy > THRESHOLD.NAVIGATION.GPS_WARNING_THRESHOLD)) {
                startSpeech("Achtung: GPS-Signal ist schwach. Die Navigation könnte ungenau sein.");
            }

            setUserLocation(updatedLocation);
        },
        [directions]
    );

    useEffect(() => {
        if (!hasLocationPermissions) return;

        Mapbox.locationManager.setRequestsAlwaysUse(true);
        Mapbox.locationManager.start();
        Mapbox.locationManager.addListener(updateUserLocation);

        return () => {
            Mapbox.locationManager.removeListener(updateUserLocation);
            Mapbox.locationManager.stop();
        };
    }, [hasLocationPermissions, updateUserLocation]);

    return <UserLocationContext.Provider value={{ userLocation }}>{children}</UserLocationContext.Provider>;
};
