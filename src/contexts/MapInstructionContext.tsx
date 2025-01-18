import { createContext } from "react";

import useInstructions from "@/hooks/useInstructions";
import { CurrentAnnotation, CurrentInstruction, LaneImage, ManeuverImage } from "@/types/INavigation";

interface ContextProps {
    currentInstruction: CurrentInstruction | undefined;
    currentAnnotation: CurrentAnnotation | undefined;
    maneuverImage: () => ManeuverImage | undefined;
    laneImages: () => LaneImage | undefined;
}

interface ProviderProps {
    children: React.ReactNode;
}

export const MapInstructionContext = createContext<ContextProps>({
    currentInstruction: undefined,
    currentAnnotation: undefined,
    maneuverImage: () => undefined,
    laneImages: () => undefined,
});

export const MapInstructionContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const { currentInstruction, currentAnnotation, maneuverImage, laneImages } = useInstructions();

    return (
        <MapInstructionContext.Provider value={{ currentInstruction, currentAnnotation, maneuverImage, laneImages }}>
            {children}
        </MapInstructionContext.Provider>
    );
};
