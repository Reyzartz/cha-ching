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
      return (
        <View style={{ minWidth: 120 }}>
          {label && (
            <Text className="font-medium text-xs text-gray-600 mb-0.5">
              {label}
            </Text>
          )}

          <TextInput
            ref={ref}
            className={`border px-2 py-1 border-gray-200 rounded bg-white text-gray-700 text-sm
              ${error ? "border-red-500" : "border-gray-200 focus:border-blue-500"}
              ${className}
            `}
            placeholderTextColor="#9CA3AF"
            {...props}
          />

          {(error || helperText) && (
            <Text
              className={`text-xs mt-1 ${error ? "text-red-500" : "text-gray-500"}`}
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
