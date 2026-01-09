import { AppHeader, Button } from "@/components";
import { useCurrentUser, useAuth } from "@/hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ActivityIndicator } from "react-native";

export default function Profile() {
  const { user, loading } = useCurrentUser();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 items-center">
      <AppHeader />
      <View className="w-full">
        {/* Header background */}
        <View className="h-36 bg-blue-200" />

        {/* Avatar + name */}
        <View className="items-center -mt-16 mb-4 px-4">
          <View className="w-32 h-32 bg-white rounded-full items-center justify-center shadow-lg border-2 border-white">
            <View className="w-28 h-28 bg-blue-500 rounded-full items-center justify-center">
              <Text className="text-3xl font-bold text-white">
                {(user?.name || "U")
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </Text>
            </View>
          </View>

          <Text className="text-2xl font-extrabold text-gray-900 mt-3">
            {user?.name || "Unknown User"}
          </Text>
        </View>

        {/* Contact card */}
        <View className="bg-white rounded-lg mx-4 p-4 mb-4 border border-gray-200 shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-500">Email</Text>
            <Text className="text-base text-gray-900">
              {user?.email || "N/A"}
            </Text>
          </View>
        </View>

        <Button
          onPress={handleLogout}
          className="mx-4 mt-auto"
          variant="outline"
          icon="logout"
        >
          Logout
        </Button>
      </View>
    </SafeAreaView>
  );
}
