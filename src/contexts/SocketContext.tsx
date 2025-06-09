import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

import { API } from "@/constants/env-constants";

import { AuthContext } from "./AuthContext";

const SocketContext = createContext<Socket | null>(null);

interface ProviderProps {
    children: React.ReactNode;
}

export const SocketContextProvider = ({ children }: ProviderProps) => {
    const { authToken } = useContext(AuthContext);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(API.UWAY_WS_URL, {
            auth: {
                token: authToken?.token,
            },
        });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [authToken?.token]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    const socket = useContext(SocketContext);

    if (!socket) return null;

    return socket;
};
