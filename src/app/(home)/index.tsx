import { useEffect, useState } from "react";
import Purchases from "react-native-purchases";
import { useDispatch } from "react-redux";

import { revenueCatActions } from "@/store/revenueCat";

import Map from "./map";
import Paywall from "./paywall";

import ToastComponent from "@/components/common/Toast";

const Home = () => {
    const dispatch = useDispatch();
    const [isSubscriptionActive, setSubscriptionActive] = useState(false);

    const checkSubscriptionStatus = async () => {
        try {
            const customerInfo = await Purchases.getCustomerInfo();
            const hasActiveSubscription = customerInfo?.entitlements?.active?.pro?.isActive;

            if (hasActiveSubscription) {
                const rcUserId = customerInfo?.originalAppUserId;
                dispatch(revenueCatActions.setRcUserId(rcUserId));
            } else {
                dispatch(revenueCatActions.setRcUserId(null));
            }

            setSubscriptionActive(hasActiveSubscription);
        } catch (error) {
            console.log(`Failed to fetch customer info: ${error}`);
        }
    };

    useEffect(() => {
        checkSubscriptionStatus();
    }, []);

    return (
        <>
            <Map />
            <ToastComponent />
        </>
    );
};

export default Home;
