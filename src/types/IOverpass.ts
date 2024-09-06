export interface Overpass<T> {
    elements: {
        type: string;
        nodes: number[];
        id: number;
        lat: number;
        lon: number;
        tags: T;
    }[];
}