import { useEffect, useCallback, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface UseAutocompleteKeyboardProps {
  showOptions: boolean;
  optionsLength: number;
  maxVisibleOptions: number;
  selectedIndex: number;
  setSelectedIndex: (index: number | ((prev: number) => number)) => void;
  onSelectOption: (index: number) => void;
  onClose: () => void;
  flatListRef: React.RefObject<any>;
}

export function useAutocompleteKeyboard({
  showOptions,
  optionsLength,
  maxVisibleOptions,
  selectedIndex,
  setSelectedIndex,
  onSelectOption,
  onClose,
  flatListRef,
}: UseAutocompleteKeyboardProps) {
  const handleKeyPress = useCallback(
    (e: any) => {
      if (!showOptions || optionsLength === 0) return;

      const visibleCount = Math.min(optionsLength, maxVisibleOptions);

      switch (e.nativeEvent.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev < visibleCount - 1 ? prev + 1 : prev;
            if (next !== prev && flatListRef.current) {
              flatListRef.current.scrollToIndex({
                index: next,
                animated: true,
              });
            }
            return next;
          });
          break;

        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : -1;
            if (next >= 0 && flatListRef.current) {
              flatListRef.current.scrollToIndex({
                index: next,
                animated: true,
              });
            }
            return next;
          });
          break;

        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < visibleCount) {
            onSelectOption(selectedIndex);
          }
          break;

        case "Escape":
          e.preventDefault();
          onClose();
          break;

        default:
          break;
      }
    },
    [
      showOptions,
      optionsLength,
      maxVisibleOptions,
      selectedIndex,
      setSelectedIndex,
      onSelectOption,
      onClose,
      flatListRef,
    ],
  );

  return { handleKeyPress };
}
