import { memo, forwardRef } from "react";
import { TextInput, TextInputProps, View, Text } from "react-native";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = memo(
  forwardRef<TextInput, InputProps>(
    ({ label, error, helperText, className = "", ...props }, ref) => {
      const inputStyles = `
    rounded-md 
    border 
    bg-white 
    px-4 
    py-3 
    text-gray-900
    ${error ? "border-red-500" : "border-gray-200 focus:border-blue-500"}
    ${className}
  `
        .trim()
        .replace(/\s+/g, " ");

      return (
        <View className="w-full">
          {label && (
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {label}
            </Text>
          )}

          <TextInput
            ref={ref}
            className={inputStyles}
            placeholderTextColor="#9CA3AF"
            {...props}
          />

          {(error || helperText) && (
            <Text
              className={`text-sm mt-1 ${error ? "text-red-500" : "text-gray-500"}`}
            >
              {error || helperText}
            </Text>
          )}
        </View>
      );
    }
  )
);

Input.displayName = "Input";

export { Input };
