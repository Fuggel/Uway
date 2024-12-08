import { useContext } from "react";

import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { SheetType } from "@/types/ISheet";

import BottomSheetComponent from "../common/BottomSheet";
import MapMarkerInfo from "./MapMarkerInfo";

interface MapBottomSheetProps {
    onClose: () => void;
    markerProps: {
        title: string;
        data: { label: string; value: string | number | React.ReactNode }[] | null;
        gasStation?: {
            show: boolean;
        };
    };
}

const MapBottomSheet = ({ onClose, markerProps }: MapBottomSheetProps) => {
    const { sheetData } = useContext(BottomSheetContext);

    if (!sheetData) return null;

    return (
        <BottomSheetComponent onClose={onClose}>
            {sheetData.type === SheetType.MARKER && (
                <MapMarkerInfo title={markerProps.title} data={markerProps.data} gasStation={markerProps.gasStation} />
            )}
        </BottomSheetComponent>
    );
};

export default MapBottomSheet;
