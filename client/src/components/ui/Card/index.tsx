import { memo } from "react";
import { View, ViewProps } from "react-native";

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

const Card = memo<CardProps>(
  ({
    children,
    variant = "default",
    padding = "md",
    className = "",
    ...props
  }) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "outlined":
          return "border border-gray-200";
        case "elevated":
          return "shadow-md shadow-gray-200";
        default:
          return "bg-white";
      }
    };

    const getPaddingStyles = () => {
      switch (padding) {
        case "none":
          return "";
        case "sm":
          return "p-3";
        case "md":
          return "p-4";
        case "lg":
          return "p-6";
        default:
          return "p-4";
      }
    };

    const cardStyles = `
    bg-white 
    rounded-lg 
    ${getVariantStyles()} 
    ${getPaddingStyles()}
    ${className}
  `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <View className={cardStyles} {...props}>
        {children}
      </View>
    );
  }
);

Card.displayName = "Card";

export { Card };
