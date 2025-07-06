import { createContext, useContext, useState } from "react";

interface ContextProps {
    splashReady: boolean;
    setSplashReady: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProviderProps {
    children: React.ReactNode;
}

const SplashContext = createContext<ContextProps | null>(null);

export const SplashContextProvider = ({ children }: ProviderProps) => {
    const [splashReady, setSplashReady] = useState(false);

    return <SplashContext.Provider value={{ splashReady, setSplashReady }}>{children}</SplashContext.Provider>;
};

export const useSplash = () => {
    const context = useContext(SplashContext);

    if (!context) {
        throw new Error("useSplash must be used within a SplashContextProvider");
    }

    return context;
};
