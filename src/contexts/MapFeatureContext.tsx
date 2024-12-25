import { createContext } from "react";

import { FeatureCollection, Geometry, GeometryCollection, Properties } from "@turf/helpers";

import useGasStations from "@/hooks/useGasStations";
import useIncidents from "@/hooks/useIncidents";
import useSpeedCameras from "@/hooks/useSpeedCameras";
import { WarningAlert } from "@/types/IMap";
import { SpeedCameraAlert } from "@/types/ISpeed";
import { IncidentAlert, WarningAlertIncident } from "@/types/ITraffic";

type SpeedCamera = {
    speedCameras: { data: FeatureCollection; alert: SpeedCameraAlert | null } | undefined;
    speedCameraWarningText: WarningAlert | null;
    loadingSpeedCameras: boolean;
    errorSpeedCameras: Error | null;
};

type Incident = {
    incidents: { data: FeatureCollection; alert: IncidentAlert | null } | undefined;
    incidentWarningText: WarningAlertIncident | null;
    loadingIncidents: boolean;
    errorIncidents: Error | null;
};

type GasStation = {
    gasStations: FeatureCollection<Geometry | GeometryCollection, Properties> | undefined;
    loadingGasStations: boolean;
    errorGasStations: Error | null;
};

interface ContextProps {
    speedCameras: SpeedCamera;
    incidents: Incident;
    gasStations: GasStation;
}

interface ProviderProps {
    children: React.ReactNode;
}

export const MapFeatureContext = createContext<ContextProps>({
    speedCameras: {
        speedCameras: undefined,
        speedCameraWarningText: null,
        loadingSpeedCameras: false,
        errorSpeedCameras: null,
    },
    incidents: {
        incidents: undefined,
        incidentWarningText: null,
        loadingIncidents: false,
        errorIncidents: null,
    },
    gasStations: {
        gasStations: undefined,
        loadingGasStations: false,
        errorGasStations: null,
    },
});

export const MapFeatureContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const speedCameras = useSpeedCameras();
    const incidents = useIncidents();
    const gasStations = useGasStations();

    return (
        <MapFeatureContext.Provider value={{ speedCameras, incidents, gasStations }}>
            {children}
        </MapFeatureContext.Provider>
    );
};
