import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import RevenueCatUI from "react-native-purchases-ui";

interface PaywallProps {
    onSubscriptionChange: () => void;
}

const Paywall = ({ onSubscriptionChange }: PaywallProps) => {
    const router = useRouter();

    return (
        <>
            <StatusBar style="light" />

            <RevenueCatUI.Paywall
                onPurchaseCompleted={() => {
                    onSubscriptionChange();
                    router.push("/map");
                }}
                onRestoreCompleted={() => {
                    onSubscriptionChange();
                }}
            />
        </>
    );
};

export default Paywall;
