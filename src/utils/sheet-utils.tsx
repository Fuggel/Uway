import { GasStation } from "@/types/IGasStation";
import { SearchSuggestionProperties } from "@/types/ISearch";
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
        case MarkerSheet.SPEED_CAMERA:
            return speedCameraTitle(properties as SpeedCameraProperties);
        case MarkerSheet.CATEGORY_LOCATION:
            return categoryTitle(properties as SearchSuggestionProperties);
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
        case MarkerSheet.SPEED_CAMERA:
            return speedCameraData(properties as SpeedCameraProperties);
        case MarkerSheet.CATEGORY_LOCATION:
            return categoryData(properties as SearchSuggestionProperties);
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
            label: "Startzeit",
            value: toGermanDate({ isoDate: incidentProperties?.startTime }) ?? "Unbekannt",
        },
        {
            label: "Endzeit",
            value: toGermanDate({ isoDate: incidentProperties?.endTime }) ?? "Unbekannt",
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
        {
            label: "Richtung",
            value: speedCameraProperties?.direction ?? "Unbekannt",
        },
    ];
}

function categoryData(suggestion: SearchSuggestionProperties) {
    return [
        {
            label: "Adresse",
            value: suggestion.full_address,
        },
        {
            label: "Entfernung",
            value: suggestion.distance,
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

export function gasStationTitle(gasStationProperties: GasStation | undefined) {
    return gasStationProperties?.brand ?? "Unbekannt";
}

export function speedCameraTitle(speedCameraProperties: SpeedCameraProperties | undefined) {
    switch (speedCameraProperties?.type) {
        case SpeedCameraType.STATIONARY:
            return "Stationärer Blitzer";
        case SpeedCameraType.MOBILE:
            return "Mobiler Blitzer";
        default:
            return "Blitzer";
    }
}

function categoryTitle(suggestion: SearchSuggestionProperties) {
    return suggestion.name;
}
