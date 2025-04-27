import Svg, { Circle, Text } from "react-native-svg";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

interface SpeedLimitProps {
    maxSpeed: string;
}

const SpeedLimit = ({ maxSpeed }: SpeedLimitProps) => {
    return (
        <Svg width="60" height="60" viewBox="0 0 40 40">
            <Circle cx="20" cy="20" r="18" fill={COLORS.white} stroke={COLORS.red} strokeWidth="3" />
            <Text
                x="52%"
                y="54%"
                fontSize={maxSpeed.length <= 2 ? SIZES.fontSize.lg : SIZES.fontSize.md}
                textAnchor="middle"
                fontFamily="Lato"
                alignmentBaseline="middle"
                fontWeight="bold"
                fill={COLORS.primary}
            >
                {maxSpeed}
            </Text>
        </Svg>
    );
};

export default SpeedLimit;
