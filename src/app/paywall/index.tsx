import { useRouter } from "expo-router";
import RevenueCatUI from "react-native-purchases-ui";

const PaywallScreen = () => {
    const router = useRouter();

    return (
        <RevenueCatUI.Paywall
            onPurchaseCompleted={() => {
                console.log("Purchase completed");
                router.push("/map");
            }}
            onRestoreCompleted={() => {
                console.log("Restore completed");
                router.push("/map");
            }}
        />
    );
};

export default PaywallScreen;
