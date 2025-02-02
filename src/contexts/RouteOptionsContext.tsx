import { createContext, useState } from "react";
import { useDispatch } from "react-redux";

import { mapNavigationActions } from "@/store/mapNavigation";

interface ContextProps {
    showRouteOptions: boolean;
    setShowRouteOptions: (show: boolean) => void;
    cancelRouteOptions: () => void;
}

interface ProviderProps {
    children: React.ReactNode;
}

export const RouteOptionsContext = createContext<ContextProps>({
    showRouteOptions: false,
    setShowRouteOptions: () => {},
    cancelRouteOptions: () => {},
});

export const RouteOptionsContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const dispatch = useDispatch();
    const [showRouteOptions, setShowRouteOptions] = useState(false);

    const cancelRouteOptions = () => {
        dispatch(mapNavigationActions.setIsNavigationMode(false));
        dispatch(mapNavigationActions.setIsNavigationSelecting(false));
        dispatch(mapNavigationActions.setRouteOptions(null));
        dispatch(mapNavigationActions.setSelectedRoute(0));
        setShowRouteOptions(false);
    };

    return (
        <RouteOptionsContext.Provider value={{ showRouteOptions, setShowRouteOptions, cancelRouteOptions }}>
            {children}
        </RouteOptionsContext.Provider>
    );
};
