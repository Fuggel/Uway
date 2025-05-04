import { useContext } from "react";

import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { SearchLocation, SearchSuggestionProperties } from "@/types/ISearch";
import { MarkerSheet, SheetType } from "@/types/ISheet";

import BottomSheetComponent from "../../common/BottomSheet";
import GasStationInfoSheet from "./GasStationInfoSheet";
import GasStationsList from "./GasStationsList";
import IncidentInfoSheet from "./IncidentInfoSheet";
import PoiList from "./PoiList";
import SpeedCameraInfoSheet from "./SpeedCameraInfoSheet";

interface MapBottomSheetProps {
    onClose: () => void;
    markerProps?: {
        title: string;
        data: { label: string; value: string | number | React.ReactNode }[] | null;
        gasStation?: {
            show: boolean;
        };
    };
    poiProps?: {
        data: SearchSuggestionProperties[] | undefined;
        onSelect: (newLocation: SearchLocation) => void;
    };
}

const MapBottomSheet = ({ onClose, markerProps, poiProps }: MapBottomSheetProps) => {
    const { sheetData } = useContext(BottomSheetContext);

    if (!sheetData) return null;

    return (
        <BottomSheetComponent
            onClose={onClose}
            height={
                sheetData.type === SheetType.POI || sheetData.type === SheetType.GAS_STATION_LIST
                    ? "50%"
                    : sheetData.markerType === MarkerSheet.GAS_STATION
                      ? "35%"
                      : undefined
            }
        >
            {sheetData.type === SheetType.MARKER && markerProps && (
                <>
                    {sheetData.markerType === MarkerSheet.GAS_STATION && <GasStationInfoSheet />}
                    {sheetData.markerType === MarkerSheet.SPEED_CAMERA && <SpeedCameraInfoSheet />}
                    {sheetData.markerType === MarkerSheet.INCIDENT && <IncidentInfoSheet />}
                </>
            )}
            {sheetData.type === SheetType.POI && poiProps && (
                <PoiList data={poiProps.data} onSelect={poiProps.onSelect} />
            )}
            {sheetData.type === SheetType.GAS_STATION_LIST && <GasStationsList />}
        </BottomSheetComponent>
    );
};

export default MapBottomSheet;
