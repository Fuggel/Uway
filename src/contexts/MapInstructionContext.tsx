import { createContext } from "react";

import useInstructions from "@/hooks/useInstructions";
import { CurrentInstruction, LaneImage, ManeuverImage } from "@/types/INavigation";

interface ContextProps {
    currentInstruction: CurrentInstruction | null;
    maneuverImage: () => ManeuverImage | undefined;
    laneImages: () => LaneImage | undefined;
}

interface ProviderProps {
    children: React.ReactNode;
}

export const MapInstructionContext = createContext<ContextProps>({
    currentInstruction: null,
    maneuverImage: () => undefined,
    laneImages: () => undefined,
});

export const MapInstructionContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const { currentInstruction, maneuverImage, laneImages } = useInstructions();

    return (
        <MapInstructionContext.Provider value={{ currentInstruction, maneuverImage, laneImages }}>
            {children}
        </MapInstructionContext.Provider>
    );
};
