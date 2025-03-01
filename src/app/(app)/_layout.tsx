import { Tabs } from "expo-router";
import { BookOpen, Home, MessageSquare, Users } from "lucide-react-native";
import { useColorScheme } from "react-native";
import { usePathname } from "expo-router";

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const pathname = usePathname();
  const hideTabBar = pathname === "/chat" || pathname.includes("/chat");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: hideTabBar ? { display: 'none' } : {
          backgroundColor: isDark ? "hsl(240, 10%, 3.9%)" : "hsl(0, 0%, 100%)", // Background color based on theme
          borderTopColor: isDark ? "hsl(240, 3.7%, 15.9%)" : "hsl(240, 5.9%, 90%)", // Border color
          paddingBottom: 10,
        },
        tabBarActiveTintColor: isDark ? "hsl(0, 0%, 98%)" : "hsl(240, 5.9%, 10%)", // Active tab color
        tabBarInactiveTintColor: isDark ? "hsl(240, 5% , 64.9%)" : "hsl(240, 3.8%, 46.1%)", // Inactive tab color
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(chat)"
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(journal)/index"
        options={{
          tabBarLabel: "Journal",
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(social)/index"
        options={{
          tabBarLabel: "Social",
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}