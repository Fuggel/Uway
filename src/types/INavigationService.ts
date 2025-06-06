export interface StartNavigation {
    authToken: string;
    destinationCoordinates: string;
    exclude: string;
    profileType: string;
    selectedRoute: number;
    isNavigationEnabled?: boolean;
}
