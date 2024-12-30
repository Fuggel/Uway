import { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";

import { UserLocationContext } from "@/contexts/UserLocationContext";
import Instructions from "@/lib/Instructions";
import { mapNavigationSelectors } from "@/store/mapNavigation";
import { CurrentInstruction } from "@/types/INavigation";

const MyComponent = () => {
    const { userLocation } = useContext(UserLocationContext);
    const directions = useSelector(mapNavigationSelectors.directions);
    const [currentInstruction, setCurrentInstruction] = useState<CurrentInstruction | null>(null);

    const steps = directions?.legs[0]?.steps;
    const annotations = directions?.legs[0]?.annotation;

    const instructions = new Instructions(steps, annotations, userLocation);

    useEffect(() => {
        if (!steps || !annotations || !userLocation) return;

        const curr = instructions.getCurrentInstructions();

        if (curr) {
            setCurrentInstruction(curr);
        }
    }, [directions, userLocation]);

    return (
        <View style={{ position: "absolute", top: 250, left: 0, right: 0, padding: 50, backgroundColor: "white" }}>
            {currentInstruction && (
                <View>
                    <Text>{currentInstruction.maneuverInstruction.instruction}</Text>
                    <Text>{currentInstruction.voiceInstruction.announcement}</Text>
                    <Text>{currentInstruction.bannerInstruction.primary.components[0].text}</Text>
                </View>
            )}
        </View>
    );
};

export default MyComponent;
