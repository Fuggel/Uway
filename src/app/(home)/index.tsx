import { useEffect, useState } from "react";
import Purchases from "react-native-purchases";

import Map from "./map";
import Paywall from "./paywall";

const Home = () => {
    const [isSubscriptionActive, setSubscriptionActive] = useState(false);

    const checkSubscriptionStatus = async () => {
        try {
            const customerInfo = await Purchases.getCustomerInfo();
            const hasActiveSubscription = Object.keys(customerInfo.entitlements.active).length > 0;

            setSubscriptionActive(hasActiveSubscription);
        } catch (error) {
            console.log(`Failed to fetch customer info: ${error}`);
        }
    };

    useEffect(() => {
        checkSubscriptionStatus();
    }, []);

    return isSubscriptionActive ? <Map /> : <Paywall onSubscriptionChange={checkSubscriptionStatus} />;
};

export default Home;
