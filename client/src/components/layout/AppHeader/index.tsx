import { memo } from "react";
import { Text, View } from "react-native";

const AppHeader = memo(() => {
  return (
    <View className="flex-row justify-center py-2 px-2 bg-white border-b border-gray-100 w-full">
      <Text className="text-lg font-semibold text-gray-900">
        💸 Cha-ching!!!
      </Text>
    </View>
  );
});

AppHeader.displayName = "AppHeader";

export { AppHeader };
