import { memo, useCallback, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Modal, Button } from "@/components/ui";
import DatePicker, {
  DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";

export interface DatePickerInputProps {
  label?: string;
  value?: Date;
  onChange: (date: Date) => void;
  error?: string;
  helperText?: string;
  maxDate?: Date;
  minDate?: Date;
  className?: string;
}

const DatePickerInput = memo<DatePickerInputProps>(
  ({
    label,
    value,
    onChange,
    error,
    helperText,
    maxDate,
    minDate,
    className = "",
  }) => {
    const defaultStyles = useDefaultStyles("light");

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
    const [modalVisible, setModalVisible] = useState(false);

    const handleDateChange = useCallback(
      (params: { date?: DateType }) => {
        if (params.date) {
          const newDate =
            typeof params.date === "string"
              ? new Date(params.date)
              : (params.date as Date);
          setSelectedDate(newDate);
          onChange(newDate);
        }
      },
      [onChange]
    );

    const handleConfirm = useCallback(() => {
      setModalVisible(false);
    }, []);

    return (
      <View style={{ minWidth: 120 }} className={className}>
        {label && (
          <Text className="font-medium text-xs text-gray-600 mb-0.5">
            {label}
          </Text>
        )}

        <Pressable
          onPress={() => setModalVisible(true)}
          className="border px-3 py-2 border-gray-200 rounded-md bg-white items-center flex-row"
        >
          <Text
            className={
              selectedDate ? "text-gray-700 flex-1" : "text-gray-400 flex-1"
            }
            numberOfLines={1}
          >
            {selectedDate ? selectedDate.toDateString() : "Select a date"}
          </Text>
        </Pressable>

        {(error || helperText) && (
          <Text
            className={`text-xs mt-1 ${
              error ? "text-red-500" : "text-gray-500"
            }`}
          >
            {error || helperText}
          </Text>
        )}

        <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
          <Modal.Body>
            <DatePicker
              mode="single"
              date={selectedDate}
              onChange={handleDateChange}
              styles={defaultStyles}
              maxDate={maxDate}
              minDate={minDate}
              style={{ width: 382 }}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button onPress={() => setModalVisible(false)} variant="outline">
              Cancel
            </Button>

            <Button onPress={handleConfirm}>Confirm</Button>
          </Modal.Footer>
        </Modal>
      </View>
    );
  }
);

DatePickerInput.displayName = "DatePickerInput";

export { DatePickerInput };
