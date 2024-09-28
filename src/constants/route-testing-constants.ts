import { Route, TestingRoute } from "../types/IMock";
import * as omtwbs from "../testing-routes/ottenser-marktplatz-to-willy-brandt-straße.json";
import * as omtm from "../testing-routes/ottenser-marktplatz-to-mercado.json";

export const TESTING_ROUTES: TestingRoute[] = [
    {
        label: "Ottenser Marktplatz to Willy-Brandt-Straße",
        value: Route.OTTENSER_MARKTPLATZ_TO_WILLY_BRANDT_STRASSE,
        coordinates: (omtwbs as any).features[0].geometry.coordinates,
    },
    {
        label: "Ottenser Marktplatz to Mercado",
        value: Route.OTTENSER_MARKTPLATZ_TO_MERCADO,
        coordinates: (omtm as any).features[0].geometry.coordinates,
    },
];
