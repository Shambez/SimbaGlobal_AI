import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { playSimbaTTS } from "@/lib/useSimbaVoice";
import { generateSimbaReply } from "@/lib/openaiSimbaVoice";

export default function TabsLayout() {
  useEffect(() => {
    const intro = "Tabs loaded. Home, Explore, and Settings are active.";
    playSimbaTTS(intro);

    generateSimbaReply(intro).then((reply) => {
      if (reply) playSimbaTTS(reply);
    });
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ff9800",
        tabBarStyle: { backgroundColor: "#fff" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}