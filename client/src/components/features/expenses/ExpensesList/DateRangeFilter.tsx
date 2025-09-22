import { memo, useCallback, useMemo, useState } from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { Button, Icon, Modal } from "@/components/ui";
import DatePicker, {
  DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";
import dayjs from "dayjs";

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

interface DateRangeFilterProps {
  label?: string;
  placeholder?: string;
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const formatDate = (date: Date | undefined) => {
  if (!date) return undefined;
  return dayjs(date).format("YYYY-MM-DD");
};

const parseDate = (dateStr: string | undefined) => {
  if (!dateStr) return undefined;
  const d = dayjs(dateStr, "YYYY-MM-DD").toDate();
  return isNaN(d.getTime()) ? undefined : d;
};

export const DateRangeFilter = memo<DateRangeFilterProps>(
  ({ value, onChange, label, placeholder = "Select Date Range" }) => {
    const defaultStyles = useDefaultStyles("light");

    const [range, setRange] = useState<{
      startDate: Date | null;
      endDate: Date | null;
    }>({
      startDate: value.startDate ? (parseDate(value.startDate) ?? null) : null,
      endDate: value.endDate ? (parseDate(value.endDate) ?? null) : null,
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [tempRange, setTempRange] = useState<{
      startDate: Date | null;
      endDate: Date | null;
    }>({
      startDate: range.startDate,
      endDate: range.endDate,
    });

    const handleTempChange = useCallback(
      (params: { startDate?: DateType; endDate?: DateType }) => {
        let start: Date | null = null;
        let end: Date | null = null;
        if (params.startDate) {
          start =
            typeof params.startDate === "string"
              ? (parseDate(params.startDate) ?? null)
              : (params.startDate as Date);
        }
        if (params.endDate) {
          end =
            typeof params.endDate === "string"
              ? (parseDate(params.endDate) ?? null)
              : (params.endDate as Date);
        }
        setTempRange({ startDate: start, endDate: end });
      },
      []
    );

    const handleConfirm = useCallback(() => {
      let start = tempRange.startDate;
      let end = tempRange.endDate;
      // If only startDate is selected, treat as single day range
      if (start && !end) {
        end = start;
      }
      setRange({ startDate: start, endDate: end });
      onChange({
        startDate: start ? formatDate(start) : undefined,
        endDate: end ? formatDate(end) : undefined,
      });
      setModalVisible(false);
    }, [tempRange, onChange]);

    const handleClearFilter = useCallback(() => {
      setRange({ startDate: null, endDate: null });
      setTempRange({ startDate: null, endDate: null });
      onChange({});
    }, [onChange]);

    const onEditDateRange = useCallback(() => {
      setTempRange({
        startDate: range.startDate,
        endDate: range.endDate,
      });
      setModalVisible(true);
    }, [range]);

    const dateRangeText = useMemo(() => {
      if (range.startDate) {
        if (
          range.endDate &&
          range.endDate.getTime() !== range.startDate.getTime()
        ) {
          return `${dayjs(range.startDate).format("MMM D, YYYY")} - ${dayjs(range.endDate).format("MMM D, YYYY")}`;
        }
        return dayjs(range.startDate).format("MMM D, YYYY");
      }
      return placeholder;
    }, [range, placeholder]);

    return (
      <>
        <View style={{ minWidth: 160 }}>
          {label && (
            <Text className="font-medium text-xs text-gray-600 mb-0.5">
              {label}
            </Text>
          )}

          <View className="border border-gray-200 rounded-md bg-white flex-row">
            <TouchableOpacity
              onPress={onEditDateRange}
              className="px-3 py-2 flex-1"
            >
              <Text
                className={range.startDate ? "text-gray-700" : "text-gray-400"}
                numberOfLines={1}
              >
                {dateRangeText}
              </Text>
            </TouchableOpacity>

            {(range.startDate || range.endDate) && (
              <Pressable
                onPress={handleClearFilter}
                className="px-2 justify-center border-l border-gray-200"
              >
                <Icon name="close" size={16} color="#3b82f6" />
              </Pressable>
            )}
          </View>
        </View>

        <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
          <Modal.Body>
            <DatePicker
              mode="range"
              startDate={tempRange.startDate}
              endDate={tempRange.endDate}
              onChange={handleTempChange}
              styles={defaultStyles}
              locale="en"
              startYear={2000}
              endYear={2100}
              style={{ width: 320 }}
              maxDate={new Date()}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button onPress={() => setModalVisible(false)} variant="outline">
              Cancel
            </Button>

            <Button onPress={handleConfirm}>Confirm</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
);

DateRangeFilter.displayName = "DateRangeFilter";
