import { memo, useState, useCallback, useRef, useEffect } from "react";
import { TextInput, View, Text } from "react-native";
import { Icon } from "../Icon";
import { AutocompleteInputProps } from "./types";
import { AutocompleteDropdown } from "./AutocompleteDropdown";
import { useDebounce, useAutocompleteKeyboard } from "./hooks";

const MAX_VISIBLE_OPTIONS = 8;
const DEFAULT_DEBOUNCE_DELAY = 300;

const AutocompleteInput = memo(
  ({
    label,
    placeholder,
    value,
    onChangeText,
    onSelectOption,
    options,
    loading = false,
    error,
    helperText,
    debounceDelay = DEFAULT_DEBOUNCE_DELAY,
    maxVisibleOptions = MAX_VISIBLE_OPTIONS,
  }: AutocompleteInputProps) => {
    const [inputValue, setInputValue] = useState(value);
    const [showOptions, setShowOptions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<TextInput>(null);
    const flatListRef = useRef<any>(null);

    const debouncedValue = useDebounce(inputValue, debounceDelay);

    useEffect(() => {
      if (debouncedValue !== value) {
        onChangeText(debouncedValue);
      }
    }, [debouncedValue, onChangeText, value]);

    const handleSelectOption = useCallback(
      (option: any) => {
        setInputValue(option.label);
        onChangeText(option.label);
        onSelectOption?.(option);
        setShowOptions(false);
        setSelectedIndex(-1);
      },
      [onChangeText, onSelectOption],
    );

    const handleSelectByIndex = useCallback(
      (index: number) => {
        const visibleOptions = options.slice(0, maxVisibleOptions);
        if (index >= 0 && index < visibleOptions.length) {
          handleSelectOption(visibleOptions[index]);
        }
      },
      [options, maxVisibleOptions, handleSelectOption],
    );

    const handleClose = useCallback(() => {
      setShowOptions(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }, []);

    const handleChangeText = useCallback((text: string) => {
      setInputValue(text);
      setSelectedIndex(-1);
      if (text.length > 0) {
        setShowOptions(true);
      } else {
        setShowOptions(false);
      }
    }, []);

    const handleFocus = useCallback(() => {
      if (inputValue.length > 0) {
        setShowOptions(true);
      }
    }, [inputValue]);

    const handleBlur = useCallback(() => {
      // Delay to allow option press to register
      setTimeout(() => {
        setShowOptions(false);
        setSelectedIndex(-1);
      }, 200);
    }, []);

    const { handleKeyPress } = useAutocompleteKeyboard({
      showOptions,
      optionsLength: options.length,
      maxVisibleOptions,
      selectedIndex,
      setSelectedIndex,
      onSelectOption: handleSelectByIndex,
      onClose: handleClose,
      flatListRef,
    });

    return (
      <View style={{ minWidth: 120 }} className="z-20">
        {label && (
          <Text className="font-medium text-xs text-gray-600 mb-0.5">
            {label}
          </Text>
        )}

        <View className="relative">
          <TextInput
            ref={inputRef}
            className={
              "border px-2 py-1 rounded bg-white text-gray-700 text-sm " +
              (error
                ? "border-red-500"
                : "border-gray-200 focus:border-blue-500")
            }
            placeholderTextColor="#9CA3AF"
            placeholder={placeholder}
            value={inputValue}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
          />

          {loading && (
            <View className="absolute right-2 top-2">
              <Icon name="loading1" size={16} color="#9CA3AF" />
            </View>
          )}

          {showOptions && options.length > 0 && (
            <AutocompleteDropdown
              options={options}
              selectedIndex={selectedIndex}
              maxVisibleOptions={maxVisibleOptions}
              flatListRef={flatListRef}
              onSelectOption={handleSelectOption}
            />
          )}
        </View>

        {(error || helperText) && (
          <Text
            className={
              "text-xs mt-1 " + (error ? "text-red-500" : "text-gray-500")
            }
          >
            {error || helperText}
          </Text>
        )}
      </View>
    );
  },
);

AutocompleteInput.displayName = "AutocompleteInput";

export { AutocompleteInput };
export type { AutocompleteOption, AutocompleteInputProps } from "./types";
