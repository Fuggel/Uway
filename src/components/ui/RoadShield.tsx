import Svg, { Circle, Path, Text } from "react-native-svg";

import { RoadShieldType } from "@/types/INavigation";

interface RoadShieldProps {
    name: RoadShieldType;
    display_ref: string;
    text_color: string;
}

const RoadShield = ({ name, display_ref, text_color }: RoadShieldProps) => {
    const roadShields: { [key in RoadShieldType]: JSX.Element } = {
        [RoadShieldType.MOTORWAY]: (
            <Svg width="60" height="35" viewBox="0 0 84 50">
                <Path
                    d="M80.7895 1H5.21053C2.88512 1 1 2.87329 1 5.1841V46.8159C1 49.1267 2.88512 51 5.21053 51H80.7895C83.1149 51 85 49.1267 85 46.8159V5.1841C85 2.87329 83.1149 1 80.7895 1Z"
                    fill="white"
                    stroke="black"
                    strokeWidth="0.25"
                />
                <Path
                    d="M3.8418 25.9999V10.1003C3.8418 9.5424 4.26285 9.12399 5.10495 8.84505L42.1576 3.02915C42.1576 3.00125 42.4383 2.9873 42.9997 2.9873C43.5611 2.9873 43.8418 3.00125 43.8418 3.02915L80.8944 8.84505C81.7365 9.12399 82.1576 9.5424 82.1576 10.1003V41.8994C82.1576 42.4573 81.7365 42.8757 80.8944 43.1547L43.8418 48.9706C43.8418 48.9985 43.5611 49.0124 42.9997 49.0124C42.4383 49.0124 42.1576 48.9985 42.1576 48.9706L5.10495 43.1547C4.26285 42.8757 3.8418 42.4573 3.8418 41.8994"
                    fill="#154889"
                />
                <RoadShieldText display_ref={display_ref} text_color={text_color} />
            </Svg>
        ),
        [RoadShieldType.MOTORWAY_EXIT]: (
            <Svg width="45" height="45" viewBox="0 0 50 50">
                <Circle cx="25" cy="25" r="20" fill="#154889" stroke="white" strokeWidth="2" />
                <RoadShieldText display_ref={display_ref} text_color={text_color} />
            </Svg>
        ),
        [RoadShieldType.FEDERAL_HIGHWAY]: (
            <Svg width="60" height="35" viewBox="0 0 84 50" fill="none">
                <Path
                    d="M74.655 0H9.345C4.1839 0 0 4.15069 0 9.27083V40.7292C0 45.8493 4.1839 50 9.345 50H74.655C79.8161 50 84 45.8493 84 40.7292V9.27083C84 4.15069 79.8161 0 74.655 0Z"
                    fill="#F0CA00"
                />
                <Path
                    d="M74.6532 1.771H9.3432C5.16793 1.771 1.7832 5.12886 1.7832 9.271V40.7293C1.7832 44.8715 5.16793 48.2293 9.3432 48.2293H74.6532C78.8285 48.2293 82.2132 44.8715 82.2132 40.7293V9.271C82.2132 5.12886 78.8285 1.771 74.6532 1.771Z"
                    fill="black"
                />
                <Path
                    d="M74.6546 4.6875H9.34461C6.79305 4.6875 4.72461 6.73953 4.72461 9.27083V40.7292C4.72461 43.2605 6.79305 45.3125 9.34461 45.3125H74.6546C77.2062 45.3125 79.2746 43.2605 79.2746 40.7292V9.27083C79.2746 6.73953 77.2062 4.6875 74.6546 4.6875Z"
                    fill="#F0CA00"
                />
                <RoadShieldText display_ref={display_ref} text_color={text_color} />
            </Svg>
        ),
        [RoadShieldType.EUROPEAN_ROAD]: (
            <Svg width="60" height="35" viewBox="0 0 84 50" fill="none">
                <Path
                    d="M7.00039 0.0867126C3.18794 0.0867126 0.0859375 3.18694 0.0859375 7.00117V43.0001C0.0859375 46.8143 3.18794 49.9146 7.00039 49.9146H76.9982C80.8106 49.9146 83.9144 46.8143 83.9144 43.0001V7.00117C83.9144 3.18694 80.8106 0.0867126 76.9982 0.0867126"
                    fill="white"
                />
                <Path
                    d="M6.99942 49.835C3.23235 49.835 0.166822 46.7659 0.166822 43.0019V7.00298C0.166822 3.23591 3.23235 0.166823 6.99942 0.166823H76.9972C80.7612 0.166823 83.8285 3.23591 83.8285 7.00298V43.0019C83.8285 46.7659 80.7612 49.835 76.9972 49.835H6.99942ZM76.9972 6.70103e-07H6.99942C3.13493 6.70103e-07 0 3.13671 0 7.00298V43.0019C0 46.8669 3.13493 50 6.99942 50H76.9972C80.8635 50 83.9966 46.8669 83.9966 43.0019V7.00298C83.9966 3.13671 80.8635 6.70103e-07 76.9972 6.70103e-07Z"
                    fill="black"
                />
                <Path
                    d="M6.9984 47.0005C4.79145 47.0005 3 45.2073 3 43.0003V7.00138C3 4.79131 4.79145 3.0012 6.9984 3.0012H76.9962C79.2049 3.0012 80.9964 4.79131 80.9964 7.00138V43.0003C80.9964 45.2073 79.2049 47.0005 76.9962 47.0005"
                    fill="#008754"
                />
                <RoadShieldText display_ref={display_ref} text_color={text_color} />
            </Svg>
        ),
    };

    return roadShields[name] || null;
};

const RoadShieldText = ({ display_ref, text_color }: Partial<RoadShieldProps>) => {
    return (
        <Text
            x="50%"
            y="52%"
            fontSize="24"
            textAnchor="middle"
            fontFamily="Lato"
            alignmentBaseline="middle"
            fontWeight="bold"
            fill={text_color}
        >
            {display_ref}
        </Text>
    );
};

export default RoadShield;
