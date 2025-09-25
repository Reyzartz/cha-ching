import React, { useRef, useState } from "react";
import {
  Pressable,
  Animated,
  Easing,
  View,
  ViewProps,
  Text,
  ScrollView,
} from "react-native";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

interface AccordionProps extends ViewProps {
  open?: boolean;
  onToggle?: (open: boolean) => void;
  title?: string;
  summary?: React.ReactNode;
  trigger?: React.ReactNode;
  children: React.ReactNode;
  duration?: number;
  collapsedHeight?: number;
  expandedHeight?: number;
}

export const Accordion: React.FC<AccordionProps> = ({
  open = true,
  onToggle,
  title,
  summary,
  trigger,
  children,
  duration = 200,
  collapsedHeight = 0,
  expandedHeight = 112,
  style,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const anim = useRef(new Animated.Value(open ? 1 : 0)).current;

  const handleToggle = () => {
    Animated.timing(anim, {
      toValue: isOpen ? 0 : 1,
      duration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
    setIsOpen((v) => {
      onToggle?.(!v);
      return !v;
    });
  };

  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View
      className="bg-white border border-gray-200 rounded-md w-full"
      style={style}
      {...props}
    >
      <Pressable
        onPress={handleToggle}
        className="flex-row items-center justify-between px-3"
        style={{ minHeight: 40 }}
      >
        <View className="flex-row items-center flex-1 gap-2">
          {title && (
            <Text
              className="font-medium text-gray-900 flex-shrink-0"
              numberOfLines={1}
            >
              {title}
            </Text>
          )}

          {!isOpen && summary && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {summary}
            </ScrollView>
          )}
        </View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Icon name="right" size={12} color="#888" />
        </Animated.View>
      </Pressable>

      <Animated.View
        style={{
          height: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [collapsedHeight, expandedHeight],
          }),
          opacity: anim,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <View className="p-3 border-t border-gray-200">{children}</View>
      </Animated.View>
    </View>
  );
};
