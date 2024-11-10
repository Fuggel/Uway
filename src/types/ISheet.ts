export enum SheetType {
    REPORT = "report",
    MARKER = "marker",
}

export enum MarkerSheet {
    INCIDENT = "incident",
    GAS_STATION = "gas_station",
    PARKING = "parking",
    SPEED_CAMERA = "speed_camera",
}

export type OpenSheet = <T>(params: { type: SheetType; markerProperties?: T; markerType?: MarkerSheet }) => void;
