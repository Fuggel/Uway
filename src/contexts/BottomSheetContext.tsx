import { createContext, useState } from "react";

import { MarkerSheet, OpenSheet, SheetType } from "@/types/ISheet";

interface SheetProperties {
    type: SheetType;
    markerType?: MarkerSheet;
    markerProperties?: any;
}

interface ContextProps {
    sheetData: SheetProperties | null;
    showSheet: boolean;
    openSheet: OpenSheet;
    closeSheet: () => void;
}

interface ProviderProps {
    children: React.ReactNode;
}

export const BottomSheetContext = createContext<ContextProps>({
    sheetData: null,
    showSheet: false,
    openSheet: () => {},
    closeSheet: () => {},
});

export const BottomSheetContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const [showSheet, setShowSheet] = useState(false);
    const [sheetData, setSheetData] = useState<SheetProperties | null>(null);

    const openSheet: OpenSheet = <T,>(params: { type: SheetType; markerProperties?: T; markerType?: MarkerSheet }) => {
        setSheetData({ type: params.type, markerType: params.markerType, markerProperties: params.markerProperties });
        setShowSheet(true);
    };

    const closeSheet = () => {
        setShowSheet(false);
        setSheetData(null);
    };

    return (
        <BottomSheetContext.Provider value={{ sheetData, showSheet, openSheet, closeSheet }}>
            {children}
        </BottomSheetContext.Provider>
    );
};
