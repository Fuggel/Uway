import { createContext, useState } from "react";

import { Location } from "@rnmapbox/maps";

interface ContextProps {
    userLocation: Location | null;
    setUserLocation: React.Dispatch<React.SetStateAction<Location | null>>;
}

interface ProviderProps {
    children: React.ReactNode;
}

export const UserLocationContext = createContext<ContextProps>({
    userLocation: null,
    setUserLocation: () => {},
});

export const UserLocationContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const [userLocation, setUserLocation] = useState<Location | null>(null);

    return (
        <UserLocationContext.Provider value={{ userLocation, setUserLocation }}>
            {children}
        </UserLocationContext.Provider>
    );
};
