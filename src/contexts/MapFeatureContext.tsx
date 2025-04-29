import { createContext } from "react";

import { FeatureCollection, Geometry, GeometryCollection, Properties } from "@turf/helpers";

import useGasStations from "@/hooks/useGasStations";
import useIncidents from "@/hooks/useIncidents";
import useSpeedCameras from "@/hooks/useSpeedCameras";
import useSpeedLimits from "@/hooks/useSpeedLimits";
import { WarningAlert } from "@/types/IWarning";

type SpeedCamera = {
    speedCameras: FeatureCollection | undefined;
    speedCameraWarning: WarningAlert | null;
    loadingSpeedCameras: boolean;
    errorSpeedCameras: Error | null;
};

type Incident = {
    incidents: FeatureCollection | undefined;
    incidentWarning: WarningAlert | null;
    loadingIncidents: boolean;
    errorIncidents: Error | null;
};

type GasStation = {
    gasStations: FeatureCollection<Geometry | GeometryCollection, Properties> | undefined;
    loadingGasStations: boolean;
    errorGasStations: Error | null;
};

type SpeedLimit = {
    speedLimits: string | null;
    loadingSpeedLimits: boolean;
    errorSpeedLimits: Error | null;
};

interface ContextProps {
    speedCameras: SpeedCamera;
    incidents: Incident;
    gasStations: GasStation;
    speedLimits: SpeedLimit;
}

interface ProviderProps {
    children: React.ReactNode;
}

export const MapFeatureContext = createContext<ContextProps>({
    speedCameras: {
        speedCameras: undefined,
        speedCameraWarning: null,
        loadingSpeedCameras: false,
        errorSpeedCameras: null,
    },
    incidents: {
        incidents: undefined,
        incidentWarning: null,
        loadingIncidents: false,
        errorIncidents: null,
    },
    gasStations: {
        gasStations: undefined,
        loadingGasStations: false,
        errorGasStations: null,
    },
    speedLimits: {
        speedLimits: null,
        loadingSpeedLimits: false,
        errorSpeedLimits: null,
    },
});

export const MapFeatureContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const speedCameras = useSpeedCameras();
    const incidents = useIncidents();
    const gasStations = useGasStations();
    const speedLimits = useSpeedLimits();

    return (
        <MapFeatureContext.Provider value={{ speedCameras, incidents, gasStations, speedLimits }}>
            {children}
        </MapFeatureContext.Provider>
    );
};
