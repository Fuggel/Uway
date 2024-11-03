import { Image, ImageProps, ImageStyle, TouchableOpacity } from "react-native";

interface ButtonProps {
    icon: ImageProps;
    onPress: () => void;
    st?: ImageStyle;
}

const Button = ({ icon, onPress, st }: ButtonProps) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <Image style={st} source={icon} />
        </TouchableOpacity>
    );
};

export default Button;
