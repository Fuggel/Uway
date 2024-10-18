import React, { useState } from "react";
import { KeyboardTypeOptions, SafeAreaView, StyleSheet, TextInput } from "react-native";

import { SIZES } from "@/constants/size-constants";

interface InputProps {
    value: string;
    onChange: (text: string) => void;
    type: KeyboardTypeOptions;
    placeholder?: string;
}

const Input = ({ value, onChange, type, placeholder }: InputProps) => {
    const [inputValue, setInputValue] = useState(value);

    return (
        <SafeAreaView>
            <TextInput
                style={styles.input}
                onChangeText={setInputValue}
                value={inputValue}
                keyboardType={type}
                placeholder={placeholder}
                onSubmitEditing={() => onChange(inputValue)}
                returnKeyType="done"
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: 60,
        borderWidth: 1,
        padding: 10,
        textAlign: "center",
        borderRadius: SIZES.borderRadius.sm,
    },
});

export default Input;
