import { useEffect, useState } from "react";

import { Location } from "@rnmapbox/maps";

import { useSocket } from "@/contexts/SocketContext";
import { SocketEvent, Warning, WarningAlert, WarningState, WarningThresholdState, WarningType } from "@/types/IWarning";

import useTextToSpeech from "./useTextToSpeech";

const useWarningListener = (params: {
    eventType: WarningType;
    playAcousticWarning: boolean;
    userLocation: Location | null;
}) => {
    const socket = useSocket();
    const { startSpeech } = useTextToSpeech();
    const [hasPlayedWarning, setHasPlayedWarning] = useState<WarningThresholdState>({ early: false, late: false });
    const [warning, setWarning] = useState<WarningAlert | null>(null);

    useEffect(() => {
        if (!socket || !params.userLocation) return;

        socket.emit(SocketEvent.USER_LOCATION_UPDATE, {
            eventType: params.eventType,
            lon: params.userLocation.coords.longitude,
            lat: params.userLocation.coords.latitude,
            heading: params.userLocation.coords.course,
            speed: params.userLocation.coords.speed,
            userId: socket.id,
        });

        const handleWarning = (data: Warning) => {
            const { text, textToSpeech, warningState, warningType, eventWarningType } = data;

            if (
                params.eventType !== warningType ||
                Object.keys(data).some((key) => data[key as keyof Warning] === null)
            ) {
                setWarning(null);
                setHasPlayedWarning({ early: false, late: false });
                return;
            }

            setWarning({ text, textToSpeech, eventWarningType });

            if (warningState !== WarningState.EARLY && warningState !== WarningState.LATE) {
                setHasPlayedWarning({ early: false, late: false });
                setWarning(null);
                return;
            }

            if (!params.playAcousticWarning) return;

            if (warningState === WarningState.EARLY && !hasPlayedWarning.early) {
                startSpeech(textToSpeech);
                setHasPlayedWarning((prev) => ({ ...prev, early: true }));
            } else if (warningState === WarningState.LATE && !hasPlayedWarning.late) {
                startSpeech(textToSpeech);
                setHasPlayedWarning((prev) => ({ ...prev, late: true }));
            }
        };

        socket.on(SocketEvent.WARNING, handleWarning);

        return () => {
            socket.off(SocketEvent.WARNING, handleWarning);
        };
    }, [socket, params.playAcousticWarning, hasPlayedWarning, params.eventType, params.userLocation]);

    return { warning };
};

export default useWarningListener;
