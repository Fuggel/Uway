import React, { useContext } from "react";

import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { IncidentProperties } from "@/types/ITraffic";
import { determineIncidentIcon, getIncidentStatusText } from "@/utils/map-utils";
import { incidentTitle } from "@/utils/sheet-utils";
import { formatLength } from "@/utils/unit-utils";

import InfoSheet from "@/components/common/InfoSheet";
import Text from "@/components/common/Text";

const IncidentInfoSheet = () => {
    const { sheetData } = useContext(BottomSheetContext);
    const { startTime, endTime, lastReportTime, length, from, iconCategory } =
        (sheetData?.markerProperties as IncidentProperties) ?? {};

    const incidentStatus = getIncidentStatusText(startTime, endTime, lastReportTime);

    return (
        <InfoSheet
            title={incidentTitle(sheetData?.markerProperties)}
            subtitle={incidentStatus}
            img={determineIncidentIcon(iconCategory)}
        >
            {from && (
                <Text type="white">
                    {from}
                    {length ? `, ${formatLength(length)}` : ""}
                </Text>
            )}
        </InfoSheet>
    );
};

export default IncidentInfoSheet;
