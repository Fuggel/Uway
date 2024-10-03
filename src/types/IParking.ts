export interface ParkAvailability {
    lots: ParkAvailabilityProperties[];
}

export interface ParkAvailabilityProperties {
    address: string;
    coords: {
        lat: number;
        lng: number;
    };
    forecast: boolean;
    free: number;
    id: string;
    lost_type: string;
    name: string;
    region: string;
    state: string;
    total: number;
}
