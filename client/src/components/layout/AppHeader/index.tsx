import { memo } from "react";
import { Text, View } from "react-native";

const AppHeader = memo(() => {
  return (
    <View className="flex-row justify-center py-4 px-4 bg-white border-b border-gray-200 w-full">
      <Text className="text-2xl font-semibold">💸 Cha-ching!!!</Text>
    </View>
  );
});

AppHeader.displayName = "AppHeader";

export { AppHeader };
