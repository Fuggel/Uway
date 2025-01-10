import { useContext } from "react";

import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { GasStation } from "@/types/IGasStation";
import { LonLat } from "@/types/IMap";
import { SheetType } from "@/types/ISheet";

import BottomSheetComponent from "../../common/BottomSheet";
import MarkerInfo from "./MarkerInfo";
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
}

const MapBottomSheet = ({ onClose, markerProps, waypointProps }: MapBottomSheetProps) => {
    const { sheetData } = useContext(BottomSheetContext);

    if (!sheetData) return null;

    return (
        <BottomSheetComponent onClose={onClose} height={sheetData.type === SheetType.WAYPOINT ? "50%" : undefined}>
            {sheetData.type === SheetType.MARKER && markerProps && (
                <MarkerInfo title={markerProps.title} data={markerProps.data} gasStation={markerProps.gasStation} />
            )}
            {sheetData.type === SheetType.WAYPOINT && waypointProps && (
                <WaypointInfo data={waypointProps.data} onSelect={waypointProps.onSelect} />
            )}
        </BottomSheetComponent>
    );
};

export default MapBottomSheet;
