import { memo } from "react";
import { Text, Pressable } from "react-native";
import { AutocompleteOption } from "./types";

interface AutocompleteOptionItemProps {
  item: AutocompleteOption;
  index: number;
  isSelected: boolean;
  onSelect: (option: AutocompleteOption) => void;
}

export const AutocompleteOptionItem = memo(
  ({ item, index, isSelected, onSelect }: AutocompleteOptionItemProps) => {
    return (
      <Pressable
        onPress={() => onSelect(item)}
        className={
          "px-3 py-2 border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 " +
          (isSelected ? "bg-blue-50" : "bg-white")
        }
      >
        <Text
          className={
            "text-sm " +
            (isSelected ? "text-blue-700 font-medium" : "text-gray-700")
          }
        >
          {item.label}
        </Text>
      </Pressable>
    );
  },
);

AutocompleteOptionItem.displayName = "AutocompleteOptionItem";
