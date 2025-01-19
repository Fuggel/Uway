import { createContext, useState } from "react";
import { useDispatch } from "react-redux";

import { mapLayoutsActions } from "@/store/mapLayouts";
import { mapNavigationActions } from "@/store/mapNavigation";
import { mapWaypointActions } from "@/store/mapWaypoint";
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
    const dispatch = useDispatch();
    const [showSheet, setShowSheet] = useState(false);
    const [sheetData, setSheetData] = useState<SheetProperties | null>(null);

    const openSheet: OpenSheet = <T,>(params: { type: SheetType; markerProperties?: T; markerType?: MarkerSheet }) => {
        setSheetData({ type: params.type, markerType: params.markerType, markerProperties: params.markerProperties });
        setShowSheet(true);
    };

    const closeSheet = () => {
        setShowSheet(false);
        setSheetData(null);
        dispatch(mapNavigationActions.setSearchQuery(""));
        dispatch(mapWaypointActions.setSelectGasStationWaypoint(false));
        dispatch(mapNavigationActions.setCategoryLocation(null));
        dispatch(mapLayoutsActions.setOpenCategoryLocationsList(false));
    };

    return (
        <BottomSheetContext.Provider value={{ sheetData, showSheet, openSheet, closeSheet }}>
            {children}
        </BottomSheetContext.Provider>
    );
};
