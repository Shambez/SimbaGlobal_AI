// app/_layout.tsx (root layout, not in /tabs)
import React, { useEffect } from "react";
import { View, StyleSheet, Image, Animated, Easing } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { Slot } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const glow = new Animated.Value(1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1.4,
          duration: 2000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 1,
          duration: 2000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2500); // splash shows ~2.5s
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/lion_imoji_512.png")}
        style={[
          styles.logo,
          {
            transform: [{ scale: glow }],
          },
        ]}
        resizeMode="contain"
      />
      {/* After splash, load app tabs */}
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black", // only behind the circle
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },
});