export interface SearchLocation {
    id?: string;
    country: string;
    country_code?: string;
    city: string;
    district?: string;
    suburb?: string;
    lon: number;
    lat: number;
    formatted: string;
    address_line1: string;
    address_line2: string;
    category: string;
    place_id: string;
}
