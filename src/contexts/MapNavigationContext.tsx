import { createContext } from "react";

import useNavigation from "@/hooks/useNavigation";
import { Direction } from "@/types/INavigation";

interface ContextProps {
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    directions: Direction | null;
    setDirections: React.Dispatch<React.SetStateAction<Direction | null>>;
    loadingDirections: boolean;
}

interface ProviderProps {
    children: React.ReactNode;
}

export const MapNavigationContext = createContext<ContextProps>({
    currentStep: 0,
    setCurrentStep: () => {},
    directions: null,
    setDirections: () => {},
    loadingDirections: false,
});

export const MapNavigationContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const { directions, setDirections, currentStep, setCurrentStep, loadingDirections } = useNavigation();

    return (
        <MapNavigationContext.Provider
            value={{
                currentStep,
                setCurrentStep,
                directions,
                setDirections,
                loadingDirections,
            }}
        >
            {children}
        </MapNavigationContext.Provider>
    );
};
