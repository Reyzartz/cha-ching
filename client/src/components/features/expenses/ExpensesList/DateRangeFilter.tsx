import { memo, useCallback, useState } from "react";
import { View, Text, Pressable, Modal, TouchableOpacity } from "react-native";
import { Card, Icon } from "@/components/ui";
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
  ({ value, onChange }) => {
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
      setRange(tempRange);
      onChange({
        startDate: tempRange.startDate
          ? formatDate(tempRange.startDate)
          : undefined,
        endDate: tempRange.endDate ? formatDate(tempRange.endDate) : undefined,
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

    return (
      <>
        <View className="border border-gray-200 rounded-md bg-white flex-row gap-2">
          <TouchableOpacity
            onPress={onEditDateRange}
            className="pl-4 pr-2     py-2"
          >
            <Text className="text-gray-400">
              {range.startDate && range.endDate
                ? `${dayjs(range.startDate).format("MMM D, YYYY")} - ${dayjs(range.endDate).format("MMM D, YYYY")}`
                : "Select Date Range"}
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

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
              }}
            >
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
              <View style={{ flexDirection: "row", marginTop: 16 }}>
                <TouchableOpacity
                  style={{
                    marginRight: 16,
                    padding: 8,
                    borderRadius: 6,
                    backgroundColor: "#2563eb",
                  }}
                  onPress={handleConfirm}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Confirm
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    backgroundColor: "#e5e7eb",
                  }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: "#374151" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }
);

DateRangeFilter.displayName = "DateRangeFilter";
