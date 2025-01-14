export enum SheetType {
    MARKER = "marker",
    WAYPOINT = "waypoint",
}

export enum MarkerSheet {
    INCIDENT = "incident",
    GAS_STATION = "gas_station",
    SPEED_CAMERA = "speed_camera",
    CATEGORY_LOCATION = "category_location",
}

export type OpenSheet = <T>(params: { type: SheetType; markerProperties?: T; markerType?: MarkerSheet }) => void;
