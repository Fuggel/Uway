import { StyleSheet, View } from "react-native";
import { Searchbar as PaperSearchbar } from "react-native-paper";
import { COLORS } from "../../constants/colors-constants";
import { useSelector } from "react-redux";
import { mapViewSelectors } from "@/src/store/mapView";
import { determineTheme, dynamicThemeStyles } from "@/src/utils/theme-utils";

interface SearchbarProps {
    placeholder: string;
    onChangeText: (query: string) => void;
    value: string;
    children?: React.ReactNode;
    st?: any;
    listSt?: any;
}

export default function Searchbar({
    placeholder,
    onChangeText,
    value,
    children,
    st,
    listSt
}: SearchbarProps) {
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);

    return (
        <View style={st}>
            <PaperSearchbar
                style={dynamicThemeStyles(styles.searchbar, determineTheme(mapStyle))}
                placeholder={placeholder}
                onChangeText={onChangeText}
                value={value}
            />
            {children &&
                <View style={{ ...listSt }}>
                    {children}
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    searchbar: {
        backgroundColor: COLORS.white_transparent,
    },
});