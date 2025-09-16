import { memo } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

export interface IconProps {
  name: keyof typeof AntDesign.glyphMap;
  size?: number;
  color?: string;
}

const Icon = memo<IconProps>(({ name, size = 24, color = "#000" }) => {
  return <AntDesign name={name} size={size} color={color} />;
});

Icon.displayName = "Icon";

export { Icon };
