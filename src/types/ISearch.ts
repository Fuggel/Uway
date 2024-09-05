export interface Suggestion {
    suggestions: {
        full_address: string;
        mapbox_id: string;
        name: string;
        place_formatted: string;
    }[];
}
