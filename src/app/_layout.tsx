import { SplashContextProvider } from "@/contexts/SplashContext";

import RootLayoutContext from "./RootLayoutContext";

export default function RootLayout() {
    return (
        <SplashContextProvider>
            <RootLayoutContext />
        </SplashContextProvider>
    );
}
