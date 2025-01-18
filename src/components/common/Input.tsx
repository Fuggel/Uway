import { KeyboardTypeOptions, SafeAreaView, StyleSheet, TextInput } from "react-native";

import { SIZES } from "@/constants/size-constants";

interface InputProps {
    value: string;
    type: KeyboardTypeOptions;
    onChange?: (text: string) => void;
    onBlur?: (text: string) => void;
    placeholder?: string;
}

const Input = ({ value, onChange, type, onBlur, placeholder }: InputProps) => {
    return (
        <SafeAreaView>
            <TextInput
                style={styles.input}
                onChangeText={onChange}
                value={value}
                keyboardType={type}
                placeholder={placeholder}
                onSubmitEditing={onChange ? () => onChange(value) : undefined}
                onBlur={onBlur ? () => onBlur(value) : undefined}
                returnKeyType="done"
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: "100%",
        borderWidth: 1,
        padding: 10,
        fontSize: SIZES.fontSize.md,
        borderRadius: SIZES.borderRadius.sm,
    },
});

export default Input;
