import useAuth from "@/hooks/useAuth";
import { Auth } from "@/types/IAuth";
import { createContext } from "react";


interface ContextProps {
    authToken: Auth | null;
}

interface ProviderProps {
    children: React.ReactNode;
}

export const AuthContext = createContext<ContextProps>({
    authToken: null,
});

export const AuthContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const { authToken } = useAuth();

    return (
        <AuthContext.Provider value={{ authToken }}>
            {children}
        </AuthContext.Provider>
    );
};
