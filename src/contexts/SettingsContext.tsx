import { createContext, useState } from "react";

interface ContextProps {
    open: boolean;
    setOpen: (value: boolean) => void;
}

interface ProviderProps {
    children: React.ReactNode;
}

export const SettingsContext = createContext<ContextProps>({
    open: false,
    setOpen: () => {},
});

export const SettingsContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const [open, setOpen] = useState(false);

    return <SettingsContext.Provider value={{ open, setOpen }}>{children}</SettingsContext.Provider>;
};
