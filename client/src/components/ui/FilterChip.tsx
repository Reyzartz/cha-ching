import React from "react";
import { Pressable, Text, View, PressableProps } from "react-native";

interface FilterChipProps extends PressableProps {
  label: string;
  selected?: boolean;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  selected,
  style,
  ...props
}) => {
  return (
    <Pressable
      className={`px-3 py-1 rounded-full border ${selected ? "bg-blue-100 border-blue-400" : "bg-white border-gray-200"}`}
      style={style}
      {...props}
    >
      <Text
        className={`text-xs font-medium ${selected ? "text-blue-700" : "text-gray-700"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
};
