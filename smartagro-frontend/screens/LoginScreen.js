import React from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  return (
    <LinearGradient colors={["#16a34a", "#15803d"]} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Image source={require("../assets/smartagro.jpg")} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Entrar</Text>
        <Text style={styles.subtitle}>Acesse sua conta</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#15803d" style={styles.icon} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#6b7280"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#15803d" style={styles.icon} />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#6b7280"
            style={styles.input}
            secureTextEntry
          />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")} style={{ width: "100%" }}>
          <LinearGradient colors={["#22c55e", "#16a34a"]} style={styles.button}>
            <Ionicons name="log-in-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Entrar</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
          <Text style={styles.registerText}>
            Ainda não tem conta? <Text style={{ fontWeight: "bold" }}>Cadastrar</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  logo: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 5 },
  subtitle: { fontSize: 16, color: "#f0fdf4", marginBottom: 30 },
  inputContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 10, paddingHorizontal: 10, marginBottom: 15,
    width: "100%", height: 50, borderWidth: 1, borderColor: "#d1d5db",
  },
  icon: { marginRight: 8 },
  input: { flex: 1, padding: 12, color: "#333" },
  button: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    padding: 14, borderRadius: 10, width: "100%", marginBottom: 15,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 5 },
  registerText: { color: "#fff", marginTop: 10 },
});
