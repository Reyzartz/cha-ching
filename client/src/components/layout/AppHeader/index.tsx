import { memo } from "react";
import { StatusBar, Text, View } from "react-native";
import { useCurrentUser } from "@/hooks";
const getInitials = (name?: string) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const ProfileIcon = memo(() => {
  const { user } = useCurrentUser();

  return (
    <View className="w-7 h-7 rounded-full bg-bl items-center justify-center border-2 border-blue-500">
      <Text className="text-blue-500  text-sm font-semibold">
        {getInitials(user?.name)}
      </Text>
    </View>
  );
});

ProfileIcon.displayName = "ProfileIcon";

const AppHeader = memo(() => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View className="flex-row justify-between items-center py-2 px-4 bg-white border-b border-gray-100 w-full">
        <View className="flex-1" />
        <Text className="text-lg font-semibold text-gray-900">
          💸 Cha-ching!!!
        </Text>
        <View className="flex-1 items-end">
          <ProfileIcon />
        </View>
      </View>
    </>
  );
});

AppHeader.displayName = "AppHeader";

export { AppHeader };
