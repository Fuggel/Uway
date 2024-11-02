import { useEffect, useState } from "react";

import Map from "./map";
import Paywall from "./paywall";

const Home = () => {
    const [isSubscriptionActive, setSubscriptionActive] = useState(false);

    useEffect(() => {
        const checkSubscriptionStatus = async () => {
            const status = await getSubscriptionStatus();
            setSubscriptionActive(status);
        };

        checkSubscriptionStatus();
    }, []);

    return <>{isSubscriptionActive ? <Map /> : <Paywall />}</>;
};

export default Home;

async function getSubscriptionStatus() {
    return true;
}
