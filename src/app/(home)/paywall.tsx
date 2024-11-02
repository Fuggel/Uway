import { useRouter } from "expo-router";
import RevenueCatUI from "react-native-purchases-ui";

interface PaywallProps {
    onSubscriptionChange: () => void;
}

const Paywall = ({ onSubscriptionChange }: PaywallProps) => {
    const router = useRouter();

    return (
        <RevenueCatUI.Paywall
            onPurchaseCompleted={() => {
                onSubscriptionChange();
                console.log("Purchase completed");
                router.push("/map");
            }}
            onRestoreCompleted={() => {
                onSubscriptionChange();
                console.log("Restore completed");
            }}
        />
    );
};

export default Paywall;
