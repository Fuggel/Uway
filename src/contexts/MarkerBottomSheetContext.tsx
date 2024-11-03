import { createContext, useState } from "react";

import { MarkerSheet } from "@/types/ISheet";

interface MarkerProperties {
    type: MarkerSheet;
    properties: any;
}

interface ContextProps {
    markerData: MarkerProperties | null;
    showMarkerSheet: boolean;
    openSheet: <T>(type: MarkerSheet, properties: T) => void;
    closeSheet: () => void;
}

interface ProviderProps {
    children: React.ReactNode;
}

export const MarkerBottomSheetContext = createContext<ContextProps>({
    markerData: null,
    showMarkerSheet: false,
    openSheet: () => {},
    closeSheet: () => {},
});

export const MarkerBottomSheetContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const [showMarkerSheet, setShowMarkerSheet] = useState(false);
    const [markerData, setMarkerData] = useState<MarkerProperties | null>(null);

    const openSheet = <T,>(type: MarkerSheet, properties: T) => {
        setMarkerData({ type, properties });
        setShowMarkerSheet(true);
    };

    const closeSheet = () => {
        setShowMarkerSheet(false);
        setMarkerData(null);
    };

    return (
        <MarkerBottomSheetContext.Provider value={{ markerData, showMarkerSheet, openSheet, closeSheet }}>
            {children}
        </MarkerBottomSheetContext.Provider>
    );
};
