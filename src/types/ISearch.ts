export interface Suggestion {
    suggestions: {
        full_address: string;
        mapbox_id: string;
        name: string;
        place_formatted: string;
    }[];
}

export interface ReverseGeocodeProperties {
    full_address: string;
    name: string;
}
