import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { playSimbaTTS } from "@/lib/useSimbaVoice";
import { generateSimbaReply } from "@/lib/openaiSimbaVoice";

const OWNER_EMAIL = "babu@shambez.com";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      if (email === OWNER_EMAIL) {
        playSimbaTTS("Welcome back, Owner. Full access unlocked.");
        router.replace("/home");
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      playSimbaTTS("Login successful. Welcome to SimbaGlobal AI KingDom.");
      const gptReply = await generateSimbaReply("User has logged in.");
      playSimbaTTS(gptReply);
      router.replace("/trial");
    } catch (err: any) {
      Alert.alert("Login Error", err.message);
    }
  };

  const handleRegister = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        phone: phone || null,
        role: user.email === OWNER_EMAIL ? "owner" : "user",
        createdAt: serverTimestamp(),
      });

      playSimbaTTS("Account created successfully. Welcome to SimbaGlobal AI KingDom.");
      const gptReply = await generateSimbaReply("New user has registered and profile created.");
      playSimbaTTS(gptReply);
      router.replace("/trial");
    } catch (err: any) {
      Alert.alert("Sign-up Error", err.message);
    }
  };

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      playSimbaTTS("A password reset link has been sent to your email.");
      const gptReply = await generateSimbaReply("User requested a password reset email.");
      playSimbaTTS(gptReply);
      Alert.alert("Password Reset", "Check your email for reset instructions.");
      setIsReset(false);
    } catch (err: any) {
      Alert.alert("Reset Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {isReset
          ? "Reset Your Password"
          : isRegister
          ? "Create SimbaGlobal AI Account"
          : "Login to SimbaGlobal AI KingDom"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {!isReset && (
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
      )}

      {isRegister && !isReset && (
        <TextInput
          style={styles.input}
          placeholder="Mobile Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      )}

      <Pressable
        style={styles.button}
        onPress={isReset ? handleReset : isRegister ? handleRegister : handleLogin}
      >
        <Text style={styles.buttonText}>
          {isReset ? "Send Reset Email" : isRegister ? "Register" : "Login"}
        </Text>
      </Pressable>

      {!isReset && (
        <Pressable onPress={() => setIsRegister(!isRegister)}>
          <Text style={styles.link}>
            {isRegister ? "Already have an account? Login" : "Don’t have an account? Register"}
          </Text>
        </Pressable>
      )}

      <Pressable onPress={() => setIsReset(!isReset)}>
        <Text style={styles.link}>
          {isReset ? "Back to Login" : "Forgot your password?"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: "#000", padding: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  link: { marginTop: 15, textAlign: "center", color: "#007bff" },
});