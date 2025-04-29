import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Socket, io } from "socket.io-client";

import { API } from "@/constants/env-constants";
import { mapNavigationSelectors } from "@/store/mapNavigation";

const SocketContext = createContext<Socket | null>(null);

interface ProviderProps {
    children: React.ReactNode;
}

export const SocketContextProvider = ({ children }: ProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);

    useEffect(() => {
        if (!isNavigationMode) return;

        const newSocket = io(API.UWAY_WS_URL);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [isNavigationMode]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    const socket = useContext(SocketContext);

    if (!socket) return null;

    return socket;
};
