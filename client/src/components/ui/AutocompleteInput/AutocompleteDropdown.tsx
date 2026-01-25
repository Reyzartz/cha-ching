import { memo } from "react";
import { View, FlatList, Platform } from "react-native";
import { AutocompleteOption } from "./types";
import { AutocompleteOptionItem } from "./AutocompleteOptionItem";

interface AutocompleteDropdownProps {
  options: AutocompleteOption[];
  selectedIndex: number;
  maxVisibleOptions: number;
  flatListRef: React.RefObject<FlatList>;
  onSelectOption: (option: AutocompleteOption) => void;
}

export const AutocompleteDropdown = memo(
  ({
    options,
    selectedIndex,
    maxVisibleOptions,
    flatListRef,
    onSelectOption,
  }: AutocompleteDropdownProps) => {
    const visibleOptions = options.slice(0, maxVisibleOptions);

    return (
      <View
        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg"
        style={{
          maxHeight: 200,
          ...Platform.select({
            web: {
              position: "absolute",
            },
          }),
          zIndex: 10000,
        }}
      >
        <FlatList
          ref={flatListRef}
          data={visibleOptions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <AutocompleteOptionItem
              item={item}
              index={index}
              isSelected={index === selectedIndex}
              onSelect={onSelectOption}
            />
          )}
          nestedScrollEnabled
          onScrollToIndexFailed={() => {}}
        />
      </View>
    );
  },
);

AutocompleteDropdown.displayName = "AutocompleteDropdown";
