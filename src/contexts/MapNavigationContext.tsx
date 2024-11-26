import { createContext } from "react";
import { useDispatch } from "react-redux";

import useNavigation from "@/hooks/useNavigation";
import useTextToSpeech from "@/hooks/useTextToSpeech";
import { mapNavigationActions } from "@/store/mapNavigation";
import { Direction } from "@/types/INavigation";

interface ContextProps {
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    directions: Direction | null;
    setDirections: React.Dispatch<React.SetStateAction<Direction | null>>;
    loadingDirections: boolean;
    handleCancelNavigation: () => void;
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
    handleCancelNavigation: () => {},
});

export const MapNavigationContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const dispatch = useDispatch();
    const { directions, setDirections, currentStep, setCurrentStep, loadingDirections } = useNavigation();
    const { stopSpeech } = useTextToSpeech();

    const handleCancelNavigation = () => {
        setDirections(null);
        setCurrentStep(0);
        dispatch(mapNavigationActions.setLocation(null));
        dispatch(mapNavigationActions.setNavigationView(false));
        dispatch(mapNavigationActions.setIsNavigationMode(false));
        dispatch(mapNavigationActions.setSearchQuery(""));
        stopSpeech();
    };

    return (
        <MapNavigationContext.Provider
            value={{
                currentStep,
                setCurrentStep,
                directions,
                setDirections,
                loadingDirections,
                handleCancelNavigation,
            }}
        >
            {children}
        </MapNavigationContext.Provider>
    );
};
