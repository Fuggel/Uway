import { useContext } from "react";

import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { GasStation } from "@/types/IGasStation";
import { LonLat } from "@/types/IMap";
import { SearchLocation, SearchSuggestionProperties } from "@/types/ISearch";
import { SheetType } from "@/types/ISheet";

import BottomSheetComponent from "../../common/BottomSheet";
import MarkerInfo from "./MarkerInfo";
import PoiList from "./PoiList";
import WaypointInfo from "./WaypointInfo";

interface MapBottomSheetProps {
    onClose: () => void;
    markerProps?: {
        title: string;
        data: { label: string; value: string | number | React.ReactNode }[] | null;
        gasStation?: {
            show: boolean;
        };
    };
    waypointProps?: {
        data: GasStation[] | undefined;
        onSelect: (coords: LonLat) => void;
    };
    poiProps?: {
        data: SearchSuggestionProperties[] | undefined;
        onSelect: (newLocation: SearchLocation) => void;
    };
}

const MapBottomSheet = ({ onClose, markerProps, waypointProps, poiProps }: MapBottomSheetProps) => {
    const { sheetData } = useContext(BottomSheetContext);

    if (!sheetData) return null;

    return (
        <BottomSheetComponent
            onClose={onClose}
            height={sheetData.type === SheetType.WAYPOINT || sheetData.type === SheetType.POI ? "50%" : undefined}
        >
            {sheetData.type === SheetType.MARKER && markerProps && (
                <MarkerInfo title={markerProps.title} data={markerProps.data} gasStation={markerProps.gasStation} />
            )}
            {sheetData.type === SheetType.WAYPOINT && waypointProps && (
                <WaypointInfo data={waypointProps.data} onSelect={waypointProps.onSelect} />
            )}
            {sheetData.type === SheetType.POI && poiProps && (
                <PoiList data={poiProps.data} onSelect={poiProps.onSelect} />
            )}
        </BottomSheetComponent>
    );
};

export default MapBottomSheet;
