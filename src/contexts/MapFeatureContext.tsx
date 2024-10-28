import { createContext } from "react";

import { FeatureCollection } from "@turf/helpers";

import useIncidents from "@/hooks/useIncidents";
import useSpeedCameras from "@/hooks/useSpeedCameras";
import { WarningAlert } from "@/types/IMap";
import { SpeedCameraAlert } from "@/types/ISpeed";
import { IncidentAlert, IncidentFc, WarningAlertIncident } from "@/types/ITraffic";

type SpeedCamera = {
    speedCameras: { data: FeatureCollection; alert: SpeedCameraAlert | null } | undefined;
    speedCameraWarningText: WarningAlert | null;
    loadingSpeedCameras: boolean;
    errorSpeedCameras: Error | null;
};

type Incident = {
    incidents: { data: IncidentFc; alert: IncidentAlert | null } | undefined;
    incidentWarningText: WarningAlertIncident | null;
    loadingIncidents: boolean;
    errorIncidents: Error | null;
};

interface ContextProps {
    speedCameras: SpeedCamera;
    incidents: Incident;
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
});

export const MapFeatureContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const speedCameras = useSpeedCameras();
    const incidents = useIncidents();

    return <MapFeatureContext.Provider value={{ speedCameras, incidents }}>{children}</MapFeatureContext.Provider>;
};
