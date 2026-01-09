import { memo } from "react";
import { Pressable, Text, PressableProps } from "react-native";
import { Icon, IconProps } from "../Icon";

export interface ButtonProps extends Omit<PressableProps, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: IconProps["name"];
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
          return "bg-blue-500 active:bg-blue-600 text-sm";
        case "secondary":
          return "bg-gray-100 active:bg-gray-200 text-sm";
        case "outline":
          return "border border-blue-200 active:bg-blue-50 text-sm";
        case "ghost":
          return "active:bg-gray-100 text-sm";
        default:
          return "bg-blue-500 active:bg-blue-600 text-sm";
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case "sm":
          return "px-2 py-1 text-sm";
        case "md":
          return "px-3 py-2 text-sm";
        case "lg":
          return "px-4 py-2 text-base";
        default:
          return "px-3 py-2 text-sm";
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
    flex 
    gap-2
    ${getTextColor()} 
    ${getTextSize()}
  `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <Pressable className={buttonStyles} {...props}>
        <Text className={textStyles}>
          {props.icon && (
            <Icon name={props.icon} size={16} color="currentColor" />
          )}
          {children}
        </Text>
      </Pressable>
    );
  }
);

Button.displayName = "Button";

export { Button };
