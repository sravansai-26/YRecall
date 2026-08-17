import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface OTPInputProps {
    code: string;
    setCode: (code: string) => void;
    maximumLength?: number;
    disabled?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({ code, setCode, maximumLength = 6, disabled = false }) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const handleOnPress = () => {
        if (!disabled) {
            setIsFocused(true);
            inputRef.current?.focus();
        }
    };

    const handleOnBlur = () => {
        setIsFocused(false);
    };

    // Prepare array of digits
    const codeDigitsArray = new Array(maximumLength).fill(0);
    
    // To ensure the array has only the length of maximumLength
    const toDigitInput = (_value: number, index: number) => {
        const emptyInputChar = ' ';
        const digit = code[index] || emptyInputChar;
        
        const isCurrentDigit = index === code.length;
        const isLastDigit = index === maximumLength - 1;
        const isCodeFull = code.length === maximumLength;
        
        const isFocusedDigit = isCurrentDigit || (isLastDigit && isCodeFull);
        
        return (
            <View 
                key={index} 
                className={`w-12 h-12 rounded-xl items-center justify-center border bg-surface-container-lowest shadow-sm
                    ${isFocused && isFocusedDigit ? 'border-primary border-2' : 'border-surface-variant'}
                `}
                style={isFocused && isFocusedDigit ? { elevation: 2 } : { elevation: 1 }}
            >
                <Text className={`font-display-sm text-center ${digit !== emptyInputChar ? 'text-primary font-bold' : 'text-on-surface'}`}>
                    {digit}
                </Text>
            </View>
        );
    };

    return (
        <View className="items-center justify-center w-full my-4">
            <Pressable 
                className="w-full flex-row justify-center gap-2"
                onPress={handleOnPress}
            >
                {codeDigitsArray.map(toDigitInput)}
            </Pressable>
            <TextInput
                ref={inputRef}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                maxLength={maximumLength}
                editable={!disabled}
                onBlur={handleOnBlur}
                onFocus={() => setIsFocused(true)}
                style={styles.hiddenTextInput}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    hiddenTextInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
    }
});
