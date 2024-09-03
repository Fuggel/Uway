export interface TestingRoute {
    label: string;
    value: string;
    coordinates: number[][];
}

export enum Route {
    OTTENSER_MARKTPLATZ_TO_WILLY_BRANDT_STRASSE = "ottenser-marktplatz-to-willy-brandt-straße",
    OTTENSER_MARKTPLATZ_TO_MERCADO = "ottenser-marktplatz-to-mercado",
}