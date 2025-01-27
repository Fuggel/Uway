import { SIZES } from "@/constants/size-constants";

import Text from "./Text";

interface CircleSeparatorProps {
    type?: "primary" | "secondary" | "gray" | "lightGray" | "white" | "success" | "error" | "warning";
}

const CircleSeparator = ({ type }: CircleSeparatorProps) => {
    return (
        <Text type={type || "white"} textStyle="header" style={{ marginHorizontal: SIZES.spacing.xs }}>
            ·
        </Text>
    );
};

export default CircleSeparator;
