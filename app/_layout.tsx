import { Stack } from "expo-router";
import { useEffect } from "react";
import { playSimbaTTS } from "@/lib/useSimbaVoice";
import { generateSimbaReply } from "@/lib/openaiSimbaVoice";

export default function RootLayout() {
  useEffect(() => {
    const intro = "SimbaGlobal AI system online. Navigation activated.";
    playSimbaTTS(intro);

    generateSimbaReply(intro).then((reply) => {
      if (reply) playSimbaTTS(reply);
    });
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}