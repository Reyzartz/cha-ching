import { memo } from "react";
import { Pressable, Text, PressableProps } from "react-native";

export interface ButtonProps extends Omit<PressableProps, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button = memo<ButtonProps>(
  ({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    className = "",
    ...props
  }) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "primary":
          return "bg-blue-500 active:bg-blue-600";
        case "secondary":
          return "bg-gray-500 active:bg-gray-600";
        case "outline":
          return "border border-blue-500 active:bg-blue-50";
        case "ghost":
          return "active:bg-gray-100";
        default:
          return "bg-blue-500 active:bg-blue-600";
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case "sm":
          return "px-3 py-2";
        case "md":
          return "px-4 py-3";
        case "lg":
          return "px-6 py-4";
        default:
          return "px-4 py-3";
      }
    };

    const getTextColor = () => {
      switch (variant) {
        case "outline":
          return "text-blue-500";
        case "ghost":
          return "text-gray-700";
        default:
          return "text-white";
      }
    };

    const getTextSize = () => {
      switch (size) {
        case "sm":
          return "text-sm";
        case "md":
          return "text-base";
        case "lg":
          return "text-lg";
        default:
          return "text-base";
      }
    };

    const buttonStyles = `
    rounded-md 
    items-center 
    justify-center 
    ${getVariantStyles()} 
    ${getSizeStyles()} 
    ${fullWidth ? "w-full" : ""}
    ${className}
  `
      .trim()
      .replace(/\s+/g, " ");

    const textStyles = `
    font-medium 
    ${getTextColor()} 
    ${getTextSize()}
  `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <Pressable className={buttonStyles} {...props}>
        <Text className={textStyles}>{children}</Text>
      </Pressable>
    );
  }
);

Button.displayName = "Button";

export { Button };
