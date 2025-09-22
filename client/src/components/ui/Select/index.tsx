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
      <View style={{ minWidth: 160 }}>
        {label && (
          <Text className="font-medium text-xs text-gray-700 mb-0.5">
            {label}
          </Text>
        )}

        <Pressable
          onPress={() => setIsOpen(true)}
          className="border px-3 py-2 border-gray-200 rounded-md bg-white items-center flex-row"
        >
          <Text
            className={
              selectedItem ? "text-gray-700 flex-1" : "text-gray-400 flex-1"
            }
            numberOfLines={1}
          >
            {selectedItem?.name || placeholder}
          </Text>

          <Icon name="caretdown" size={10} color="#6b7280" />
        </Pressable>

        <Modal
          visible={isOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsOpen(false)}
        >
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
            onPress={() => setIsOpen(false)}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 0,
                alignItems: "stretch",
                width: 320,
                maxHeight: 384,
                overflow: "hidden",
              }}
            >
              <ScrollView>
                {items.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => handleSelect(item.id)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: "#f3f4f6",
                      backgroundColor: item.id === value ? "#eff6ff" : "#fff",
                    }}
                  >
                    <Text
                      style={{
                        color: item.id === value ? "#2563eb" : "#111827",
                        fontWeight: item.id === value ? "bold" : "normal",
                        fontSize: 16,
                      }}
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
