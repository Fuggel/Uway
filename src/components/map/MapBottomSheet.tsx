import { useContext } from "react";

import { UseMutateFunction } from "@tanstack/react-query";

import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { SheetType } from "@/types/ISheet";

import BottomSheetComponent from "../common/BottomSheet";
import MapMarkerInfo from "./MapMarkerInfo";
import MapSpeedCameraReport from "./MapSpeedCameraReport";

interface MapBottomSheetProps {
    onClose: () => void;
    markerProps: {
        title: string;
        data: { label: string; value: string | number | React.ReactNode }[] | null;
        gasStation?: {
            show: boolean;
            onPress: () => void;
        };
    };
    reportProps: {
        refetchData: UseMutateFunction<any, unknown, any, unknown>;
    };
}

const MapBottomSheet = ({ onClose, markerProps, reportProps }: MapBottomSheetProps) => {
    const { sheetData } = useContext(BottomSheetContext);

    if (!sheetData) return null;

    return (
        <BottomSheetComponent onClose={onClose}>
            {sheetData.type === SheetType.MARKER && (
                <MapMarkerInfo title={markerProps.title} data={markerProps.data} gasStation={markerProps.gasStation} />
            )}
            {sheetData.type === SheetType.REPORT && (
                <MapSpeedCameraReport refetchData={reportProps.refetchData} onClose={onClose} />
            )}
        </BottomSheetComponent>
    );
};

export default MapBottomSheet;
