import { memo } from "react";
import { StatusBar, Text, View } from "react-native";

const AppHeader = memo(() => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View className="flex-row justify-center py-2 px-2 bg-white border-b border-gray-100 w-full">
        <Text className="text-lg font-semibold text-gray-900">
          💸 Cha-ching!!!
        </Text>
      </View>
    </>
  );
});

AppHeader.displayName = "AppHeader";

export { AppHeader };
