import { View } from "react-native";
import { Searchbar as PaperSearchbar } from "react-native-paper";

interface SearchbarProps {
    placeholder: string;
    onChangeText: (query: string) => void;
    value: string;
    children?: React.ReactNode;
    st?: any;
    listSt?: any;
}

export default function Searchbar({ placeholder, onChangeText, value, children, st, listSt }: SearchbarProps) {
    return (
        <View style={{ zIndex: 999999, ...st }}>
            <PaperSearchbar
                style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
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