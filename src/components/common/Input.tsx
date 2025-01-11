import React, { useState } from "react";
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
    const [inputValue, setInputValue] = useState(value);

    return (
        <SafeAreaView>
            <TextInput
                style={styles.input}
                onChangeText={setInputValue}
                value={inputValue}
                keyboardType={type}
                placeholder={placeholder}
                onSubmitEditing={onChange ? () => onChange(inputValue) : undefined}
                onBlur={onBlur ? () => onBlur(inputValue) : undefined}
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
        textAlign: "center",
        borderRadius: SIZES.borderRadius.sm,
    },
});

export default Input;
