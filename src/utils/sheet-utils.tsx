import { MarkerSheet } from "../types/ISheet";
import PriceDisplay from "../components/ui/PriceDisplay";
import { GasStation } from "../types/IGasStation";
import { IncidentProperties, IncidentType } from "../types/ITraffic";
import { ParkAvailabilityProperties } from "../types/IParking";
import { SpeedCameraProperties } from "../types/ISpeed";

export function sheetTitle<T>(marker: MarkerSheet | undefined, properties: T): string {
    switch (marker) {
        case MarkerSheet.INCIDENT:
            return incidentTitle(properties as IncidentProperties);
        case MarkerSheet.GAS_STATION:
            return gasStationTitle(properties as GasStation);
        case MarkerSheet.PARKING:
            return parkingTitle(properties as ParkAvailabilityProperties);
        case MarkerSheet.SPEED_CAMERA:
            return speedCameraTitle(properties as SpeedCameraProperties);
        default:
            return "Unbekannt";
    }
}

export function sheetData<T>(
    marker: MarkerSheet | undefined,
    properties: T
): { label: string; value: string | JSX.Element | IncidentType }[] | null {
    switch (marker) {
        case MarkerSheet.INCIDENT:
            return incidentData(properties as IncidentProperties);
        case MarkerSheet.GAS_STATION:
            return gasStationData(properties as GasStation);
        case MarkerSheet.PARKING:
            return parkingData(properties as ParkAvailabilityProperties);
        case MarkerSheet.SPEED_CAMERA:
            return speedCameraData(properties as SpeedCameraProperties);
        default:
            return null;
    }
}

function incidentData(incidentProperties: IncidentProperties | undefined) {
    return [
        {
            label: "Typ",
            value: incidentProperties?.iconCategory ?? "Unbekannt",
        },
        {
            label: "Von",
            value: incidentProperties?.from ?? "Unbekannt",
        },
        {
            label: "Bis",
            value: incidentProperties?.to ?? "Unbekannt",
        },
        {
            label: "Länge",
            value: incidentProperties?.length ? `${incidentProperties.length} km` : "Unbekannt",
        },
        {
            label: "Verzögerung",
            value: incidentProperties?.magnitudeOfDelay ? `${incidentProperties.magnitudeOfDelay} min` : "Unbekannt",
        },
    ];
}

function gasStationData(gasStationProperties: GasStation | undefined) {
    return [
        {
            label: "Marke",
            value: gasStationProperties?.brand ?? "Unbekannt",
        },
        {
            label: "Straße",
            value: gasStationProperties?.name ?? "Unbekannt",
        },
        {
            label: "Diesel",
            value: gasStationProperties?.diesel ? <PriceDisplay price={gasStationProperties.diesel} /> : "Unbekannt",
        },
        {
            label: "E5",
            value: gasStationProperties?.e5 ? <PriceDisplay price={gasStationProperties.e5} /> : "Unbekannt",
        },
        {
            label: "E10",
            value: gasStationProperties?.e10 ? <PriceDisplay price={gasStationProperties.e10} /> : "Unbekannt",
        },
    ];
}

function parkingData(parkingProperties: ParkAvailabilityProperties | undefined) {
    return [
        {
            label: "Adresse",
            value: parkingProperties?.address ?? "Unbekannt",
        },
        {
            label: "Freie Plätze",
            value: parkingProperties
                ? `${parkingProperties.free ?? "Unbekannt"} von ${parkingProperties.total ?? "Unbekannt"}`
                : "Unbekannt",
        },
    ];
}

function speedCameraData(speedCameraProperties: SpeedCameraProperties | undefined) {
    return [
        {
            label: "Straße",
            value: speedCameraProperties?.highway ?? "Unbekannt",
        },
        {
            label: "Richtung",
            value: speedCameraProperties?.direction ?? "Unbekannt",
        },
        {
            label: "Max. Geschwindigkeit",
            value: speedCameraProperties?.maxspeed ?? "Unbekannt",
        },
    ];
}

function incidentTitle(incidentProperties: IncidentProperties | undefined) {
    switch (incidentProperties?.iconCategory) {
        case IncidentType.Accident:
            return "Unfall";
        case IncidentType.DangerousConditions:
            return "Gefährliche Bedingungen";
        case IncidentType.Rain:
            return "Regen";
        case IncidentType.Ice:
            return "Eis";
        case IncidentType.Jam:
            return "Stau";
        case IncidentType.LaneClosed:
            return "Spur geschlossen";
        case IncidentType.RoadClosed:
            return "Straße geschlossen";
        case IncidentType.RoadWorks:
            return "Straßenarbeiten";
        case IncidentType.Wind:
            return "Wind";
        case IncidentType.BrokenDownVehicle:
            return "Fahrzeugpanne";
        default:
            return "Unbekannt";
    }
}

function gasStationTitle(gasStationProperties: GasStation | undefined) {
    return gasStationProperties?.brand ?? "Unbekannt";
}

function parkingTitle(parkingProperties: ParkAvailabilityProperties | undefined) {
    return parkingProperties?.name ?? "Unbekannt";
}

function speedCameraTitle(speedCameraProperties: SpeedCameraProperties | undefined) {
    return speedCameraProperties?.highway ?? "Unbekannt";
}
