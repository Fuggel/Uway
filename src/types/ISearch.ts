import { Geometry } from "@turf/helpers";

export interface SearchSuggestion {
    suggestions: SearchSuggestionProperties[];
}

export interface SearchSuggestionProperties {
    default_id: string;
    mapbox_id: string;
    name: string;
    full_address: string;
    place_formatted: string;
    distance: number;
    maki: string;
    feature_type: string;
    coordinates: {
        longitude: number;
        latitude: number;
    };
}

export interface SearchLocation {
    name: string;
    default_id: string;
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

export interface SavedSearchLocation extends SearchLocation {
    title?: string;
}

export interface SearchFeatureCollection {
    type: string;
    features: SearchFeature[];
}

export interface SearchFeature {
    type: string;
    geometry: Geometry;
    properties: SearchSuggestionProperties;
}

export interface LocationId {
    default: string;
    mapbox_id: string | null;
    saveSearch?: boolean;
}

export enum SaveSearchError {
    DUPLICATE = "DUPLICATE",
    NONE = "NONE",
}
