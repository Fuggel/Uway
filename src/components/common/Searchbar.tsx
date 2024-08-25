import { View } from "react-native";
import { Searchbar as PaperSearchbar } from "react-native-paper";
import { COLORS } from "../../constants/colors-constants";

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
    return (
        <View style={st}>
            <PaperSearchbar
                style={{ backgroundColor: COLORS.white_transparent }}
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