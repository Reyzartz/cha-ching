import { memo, useCallback, useState } from "react";
import { View, Text, Modal, Pressable, ScrollView } from "react-native";
import { Icon } from "../Icon";

interface SelectProps {
  label: string;
  value?: string | number;
  items: { id: number; name: string }[];
  placeholder?: string;
  onChange: (value: number) => void;
}

const Select = memo<SelectProps>(
  ({ label, value, items, placeholder = "Select an option", onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedItem = items.find((item) => item.id === value);

    const handleSelect = useCallback(
      (itemId: number) => {
        onChange(itemId);
        setIsOpen(false);
      },
      [onChange]
    );

    return (
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
        <Pressable
          onPress={() => setIsOpen(true)}
          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg flex-row items-center justify-between"
        >
          <Text className={selectedItem ? "text-gray-900" : "text-gray-400"}>
            {selectedItem?.name || placeholder}
          </Text>
          <Icon name="caretdown" size={20} color="#6B7280" />
        </Pressable>

        <Modal
          visible={isOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsOpen(false)}
        >
          <Pressable
            className="flex-1 bg-black/50 justify-center items-center"
            onPress={() => setIsOpen(false)}
          >
            <View className="bg-white rounded-lg w-80 max-h-96 overflow-hidden">
              <ScrollView>
                {items.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => handleSelect(item.id)}
                    className={`px-4 py-3 border-b border-gray-100 ${
                      item.id === value ? "bg-blue-50" : ""
                    }`}
                  >
                    <Text
                      className={
                        item.id === value ? "text-blue-600" : "text-gray-900"
                      }
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  }
);

Select.displayName = "Select";

export { Select };
