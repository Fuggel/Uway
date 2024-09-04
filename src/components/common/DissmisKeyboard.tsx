import { TouchableWithoutFeedback, Keyboard } from "react-native";

interface DismissKeyboardProps {
    children: React.ReactNode;
}

export default function DismissKeyboard({ children }: DismissKeyboardProps) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            {children}
        </TouchableWithoutFeedback>
    );
}