import { ImageSourcePropType } from "react-native";

export interface MapStyle {
    label: string;
    value: string;
    img?: ImageSourcePropType;
}

export interface DropdownItem {
    label: string;
    value: string;
}
