import { Size } from "../types/ISize";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export const SIZES: Size = {
    spacing: {
        xs: wp("2%"),
        sm: wp("3%"),
        md: wp("6%"),
        lg: wp("10%"),
        xl: wp("12%"),
    },
    borderRadius: {
        sm: wp("1%"),
        md: wp("2%"),
        lg: wp("4%"),
        xl: wp("8%"),
    },
    fontSize: {
        sm: wp("3.5%"),
        md: wp("4%"),
        lg: wp("5%"),
        xl: wp("8%"),
    },
    iconSize: {
        sm: wp("5%"),
        md: wp("8%"),
        lg: wp("10%"),
        xl: wp("12%"),
    },
};