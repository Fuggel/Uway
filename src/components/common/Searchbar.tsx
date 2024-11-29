import { StyleSheet, TouchableOpacity, View } from "react-native";
import SearchBar from "react-native-platform-searchbar";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { SIZES } from "@/constants/size-constants";

interface SearchbarProps {
    placeholder: string;
    onChangeText: (query: string) => void;
    value: string;
    children?: React.ReactNode;
    speechToText?: {
        isListening: boolean;
        startListening: () => void;
        stopListening: () => void;
    };
    onClear: () => void;
}

const Searchbar = ({ placeholder, onChangeText, value, children, speechToText, onClear }: SearchbarProps) => {
    return (
        <>
            <View style={styles.searchContainer}>
                <SearchBar
                    platform="default"
                    cancelText={""}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    onClear={onClear}
                    value={value}
                />
                {speechToText && (
                    <TouchableOpacity
                        onPress={speechToText.isListening ? speechToText.stopListening : speechToText.startListening}
                    >
                        <MaterialCommunityIcons
                            name={speechToText.isListening ? "microphone-off" : "microphone"}
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                )}
            </View>

            {children && children}
        </>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: SIZES.spacing.xs,
        paddingHorizontal: SIZES.spacing.md,
    },
});

export default Searchbar;
