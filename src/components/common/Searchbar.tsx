import { StyleSheet, View, ViewStyle } from "react-native";
import SearchBar from "react-native-platform-searchbar";
import { useSelector } from "react-redux";

import { COLORS } from "@/constants/colors-constants";
import { mapViewSelectors } from "@/store/mapView";
import { determineTheme, dynamicThemeStyles } from "@/utils/theme-utils";

interface SearchbarProps {
    placeholder: string;
    onChangeText: (query: string) => void;
    value: string;
    children?: React.ReactNode;
    st?: ViewStyle;
    listSt?: ViewStyle;
}

const Searchbar = ({ placeholder, onChangeText, value, children, st, listSt }: SearchbarProps) => {
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);

    return (
        <View style={st}>
            <SearchBar
                platform="default"
                cancelText={""}
                inputStyle={dynamicThemeStyles(styles.searchbar, determineTheme(mapStyle))}
                placeholder={placeholder}
                onChangeText={onChangeText}
                value={value}
            />
            {children && <View style={listSt}>{children}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    searchbar: {
        backgroundColor: COLORS.white_transparent,
    },
});

export default Searchbar;
