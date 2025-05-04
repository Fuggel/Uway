import React, { useContext } from "react";

import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { SpeedCameraProperties } from "@/types/ISpeed";
import { speedCameraTitle } from "@/utils/sheet-utils";

import InfoSheet from "@/components/common/InfoSheet";
import Text from "@/components/common/Text";

const SpeedCameraInfoSheet = () => {
    const { sheetData } = useContext(BottomSheetContext);
    const { address, maxspeed } = (sheetData?.markerProperties as SpeedCameraProperties) ?? {};

    return (
        <InfoSheet
            title={speedCameraTitle(sheetData?.markerProperties)}
            subtitle={address}
            img={require(`../../../assets/images/map-icons/speed-camera/speed-camera.png`)}
        >
            {maxspeed && <Text type="white">Höchstgeschwindigkeit: {maxspeed} km/h</Text>}
        </InfoSheet>
    );
};

export default SpeedCameraInfoSheet;
