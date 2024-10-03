import { useState } from "react";
import { MarkerSheet } from "../types/ISheet";

interface MarkerProperties {
    type: MarkerSheet;
    properties: any;
}

export default function useMarkerBottomSheet() {
    const [showSheet, setShowSheet] = useState(false);
    const [markerData, setMarkerData] = useState<MarkerProperties | null>(null);

    const openSheet = <T>(type: MarkerSheet, properties: T) => {
        setMarkerData({ type, properties });
        setShowSheet(true);
    };

    const closeSheet = () => {
        setShowSheet(false);
        setMarkerData(null);
    };

    return {
        showSheet,
        markerData,
        openSheet,
        closeSheet,
    };
}
