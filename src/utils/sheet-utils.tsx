import { GasStation } from "@/types/IGasStation";
import { ParkAvailabilityProperties } from "@/types/IParking";
import { MarkerSheet } from "@/types/ISheet";
import { SpeedCameraProperties, SpeedCameraType } from "@/types/ISpeed";
import { IncidentProperties, IncidentType } from "@/types/ITraffic";

import { toGermanDate } from "./date-utils";
import { formatLength } from "./unit-utils";

import PriceDisplay from "@/components/ui/PriceDisplay";

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
            label: "Von",
            value: incidentProperties?.from ?? "Unbekannt",
        },
        {
            label: "Bis",
            value: incidentProperties?.to ?? "Unbekannt",
        },
        {
            label: "Länge",
            value: incidentProperties?.length ? formatLength(incidentProperties.length) : "Unbekannt",
        },
        {
            label: "Verzögerung",
            value: incidentProperties?.delay ? `${incidentProperties.delay.toFixed(0)} min` : "Unbekannt",
        },
        {
            label: "Startzeit",
            value: toGermanDate({ isoDate: incidentProperties?.startTime }) ?? "Unbekannt",
        },
        {
            label: "Endzeit",
            value: toGermanDate({ isoDate: incidentProperties?.endTime }) ?? "Unbekannt",
        },
        {
            label: "Letzte Meldung",
            value: toGermanDate({ isoDate: incidentProperties?.lastReportTime }) ?? "Unbekannt",
        },
    ];
}

function gasStationData(gasStationProperties: GasStation | undefined) {
    const street = gasStationProperties?.street;
    const houseNumber = gasStationProperties?.houseNumber;
    const postCode = gasStationProperties?.postCode;
    const place = gasStationProperties?.place;

    const address = street
        ? `${street} ${houseNumber}, ${postCode} ${place}`
        : (gasStationProperties?.name ?? "Unbekannt");

    return [
        {
            label: "Marke",
            value: gasStationProperties?.brand ?? "Unbekannt",
        },
        {
            label: "Straße",
            value: address,
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
            value: speedCameraProperties?.address ?? "Unbekannt",
        },
        {
            label: "Typ",
            value: speedCameraProperties?.type === SpeedCameraType.MOBILE ? "Mobil" : "Stationär",
        },
    ];
}

export function incidentTitle(incidentProperties: IncidentProperties | undefined) {
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
            return "Gefahr";
    }
}

function gasStationTitle(gasStationProperties: GasStation | undefined) {
    return gasStationProperties?.brand ?? "Unbekannt";
}

function parkingTitle(parkingProperties: ParkAvailabilityProperties | undefined) {
    const title = parkingProperties?.name ?? "Unbekannt";
    const fullTitle = `${
        !title.includes(parkingProperties?.lot_type as string) ? `${parkingProperties?.lot_type} ${title}` : title
    }`;

    return fullTitle;
}

function speedCameraTitle(speedCameraProperties: SpeedCameraProperties | undefined) {
    return `Blitzer: ${speedCameraProperties?.type === SpeedCameraType.MOBILE ? "Mobil" : "Stationär"}`;
}
