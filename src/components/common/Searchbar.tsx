import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import SearchBar from "react-native-platform-searchbar";
import { useSelector } from "react-redux";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "@/constants/colors-constants";
import { mapViewSelectors } from "@/store/mapView";
import { determineTheme, dynamicThemeStyles } from "@/utils/theme-utils";

interface SearchbarProps {
    placeholder: string;
    onChangeText: (query: string) => void;
    value: string;
    onFocus?: () => void;
    children?: React.ReactNode;
    st?: ViewStyle;
    listSt?: ViewStyle;
    speechToText?: {
        isListening: boolean;
        startListening: () => void;
        stopListening: () => void;
    };
}

const Searchbar = ({
    placeholder,
    onChangeText,
    value,
    onFocus,
    children,
    speechToText,
    st,
    listSt,
}: SearchbarProps) => {
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);

    return (
        <View style={st}>
            <View style={styles.searchContainer}>
                <SearchBar
                    platform="default"
                    cancelText={""}
                    inputStyle={dynamicThemeStyles(styles.searchbar, determineTheme(mapStyle))}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    onClear={() => onChangeText("")}
                    value={value}
                    onFocus={onFocus}
                    leftIcon={
                        speechToText && (
                            <TouchableOpacity
                                onPress={
                                    speechToText.isListening ? speechToText.stopListening : speechToText.startListening
                                }
                            >
                                <MaterialCommunityIcons
                                    name={speechToText.isListening ? "microphone-off" : "microphone"}
                                    size={24}
                                    color="black"
                                />
                            </TouchableOpacity>
                        )
                    }
                />
            </View>

            {children && <View style={listSt}>{children}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    searchbar: {
        backgroundColor: COLORS.white_transparent,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});

export default Searchbar;
