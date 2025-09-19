import { Tabs } from "expo-router";
import { Icon } from "@/components";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3B82F6", // Tailwind blue-500
        tabBarInactiveTintColor: "#6B7280", // Tailwind gray-500
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarIcon: ({ color, size }) => (
            <Icon name="appstore-o" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="payment-methods"
        options={{
          title: "Payments",
          tabBarIcon: ({ color, size }) => (
            <Icon name="creditcard" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
