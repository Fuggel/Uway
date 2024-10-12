import { createContext, useState } from "react";

import { MarkerSheet } from "@/types/ISheet";

interface MarkerProperties {
    type: MarkerSheet;
    properties: any;
}

interface ContextProps {
    markerData: MarkerProperties | null;
    showSheet: boolean;
    openSheet: <T>(type: MarkerSheet, properties: T) => void;
    closeSheet: () => void;
}

interface ProviderProps {
    children: React.ReactNode;
}

export const MarkerBottomSheetContext = createContext<ContextProps>({
    markerData: null,
    showSheet: false,
    openSheet: () => {},
    closeSheet: () => {},
});

export const MarkerBottomSheetContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const [showSheet, setShowSheet] = useState(false);
    const [markerData, setMarkerData] = useState<MarkerProperties | null>(null);

    const openSheet = <T,>(type: MarkerSheet, properties: T) => {
        setMarkerData({ type, properties });
        setShowSheet(true);
    };

    const closeSheet = () => {
        setShowSheet(false);
        setMarkerData(null);
    };

    return (
        <MarkerBottomSheetContext.Provider value={{ markerData, showSheet, openSheet, closeSheet }}>
            {children}
        </MarkerBottomSheetContext.Provider>
    );
};
