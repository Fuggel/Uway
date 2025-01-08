export interface SearchSuggestion {
    suggestions: SearchSuggestionProperties[];
}

export interface SearchSuggestionProperties {
    mapbox_id: string;
    name: string;
    full_address: string;
    place_formatted: string;
    distance: number;
}

export interface SearchLocation {
    name: string;
    mapbox_id?: string;
    feature_type: string;
    address: string;
    full_address: string;
    place_formatted: string;
    maki: string;
    coordinates: {
        longitude: number;
        latitude: number;
    };
}
