export interface GasStation {
    id: string;
    name: string;
    brand: string;
    street: string;
    place: string;
    lat: number;
    lng: number;
    dist: number;
    diesel: number;
    e5: number;
    e10: number;
    isOpen: boolean;
    houseNumber: string;
    postCode: number;
    iconType: IconType;
}

export enum DefaultFilter {
    ALL = "all",
}

export enum FuelType {
    DIESEL = "Diesel",
    E5 = "E5",
    E10 = "E10",
}

export enum IconType {
    GAS_STATION_CHEAP = "gas-station-cheap",
    GAS_STATION_AVERAGE = "gas-station-average",
    GAS_STATION_EXPENSIVE = "gas-station-expensive",
}