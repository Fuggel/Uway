import { StyleSheet, Text, TextStyle, ViewStyle } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";

import { COLORS } from "@/constants/colors-constants";

interface ActionProps {
    text: string;
    bgSt?: ViewStyle;
    textSt?: TextStyle;
}

interface SwipeableProps {
    actionProps: ActionProps;
    children: React.ReactNode;
    st?: ViewStyle;
}

const ACTION_OFFSET = 75;

const Action = (_: SharedValue<number>, drag: SharedValue<number>, props: ActionProps) => {
    const styleAnimation = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: drag.value + ACTION_OFFSET }],
            backgroundColor: "red",
            ...props.bgSt,
        };
    });

    return (
        <Reanimated.View style={styleAnimation}>
            <Text style={{ ...styles.action, ...props.textSt }}>{props.text}</Text>
        </Reanimated.View>
    );
};

const Swipable = ({ actionProps, st, children }: SwipeableProps) => {
    return (
        <ReanimatedSwipeable
            containerStyle={st}
            friction={2}
            enableTrackpadTwoFingerGesture
            rightThreshold={40}
            renderRightActions={(_, drag: SharedValue<number>) => Action(_, drag, actionProps)}
        >
            {children}
        </ReanimatedSwipeable>
    );
};

export default Swipable;

const styles = StyleSheet.create({
    action: {
        height: "100%",
        width: ACTION_OFFSET,
        color: COLORS.white,
        textAlign: "center",
        textAlignVertical: "center",
    },
});
