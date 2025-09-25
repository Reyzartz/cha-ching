import React from "react";
import { View, ViewProps } from "react-native";

interface ProgressBarProps extends ViewProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = "#3B82F6", // Tailwind blue-500
  height = 8,
  style,
  ...props
}) => {
  return (
    <View
      className={[
        "w-full bg-gray-200 rounded-full overflow-hidden",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={[{ height }, style]}
      {...props}
    >
      <View
        style={{
          width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
          backgroundColor: color,
          height: "100%",
        }}
      />
    </View>
  );
};
