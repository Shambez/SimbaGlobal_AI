import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync().catch(()=>{});

export default function Root() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(()=>{});
  }, []);
  return <Slot />;
}
