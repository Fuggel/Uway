import { useContext } from "react";

import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { SearchLocation, SearchSuggestionProperties } from "@/types/ISearch";
import { SheetType } from "@/types/ISheet";

import BottomSheetComponent from "../../common/BottomSheet";
import GasStationsList from "./GasStationsList";
import MarkerInfo from "./MarkerInfo";
import PoiList from "./PoiList";

interface MapBottomSheetProps {
    onClose: () => void;
    markerProps?: {
        title: string;
        data: { label: string; value: string | number | React.ReactNode; }[] | null;
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
                sheetData.type === SheetType.POI ||
                    sheetData.type === SheetType.GAS_STATION_LIST
                    ? "50%"
                    : undefined
            }
        >
            {sheetData.type === SheetType.MARKER && markerProps && (
                <MarkerInfo title={markerProps.title} data={markerProps.data} gasStation={markerProps.gasStation} />
            )}
            {sheetData.type === SheetType.POI && poiProps && (
                <PoiList data={poiProps.data} onSelect={poiProps.onSelect} />
            )}
            {sheetData.type === SheetType.GAS_STATION_LIST && <GasStationsList />}
        </BottomSheetComponent>
    );
};

export default MapBottomSheet;
