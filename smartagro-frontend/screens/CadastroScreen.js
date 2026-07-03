import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../config";

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (response.ok && data.sucesso) {
        Alert.alert("Cadastro", "Conta criada com sucesso!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Erro", data.mensagem || "Erro ao cadastrar.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  return (
    <LinearGradient colors={["#16a34a", "#15803d"]} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha os dados abaixo</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#15803d" style={styles.icon} />
          <TextInput placeholder="Nome completo" style={styles.input} value={nome} onChangeText={setNome} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#15803d" style={styles.icon} />
          <TextInput placeholder="E-mail" style={styles.input} value={email} onChangeText={setEmail} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#15803d" style={styles.icon} />
          <TextInput placeholder="Senha" secureTextEntry style={styles.input} value={senha} onChangeText={setSenha} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#15803d" style={styles.icon} />
          <TextInput placeholder="Confirmar senha" secureTextEntry style={styles.input} value={confirmarSenha} onChangeText={setConfirmarSenha} />
        </View>

        <TouchableOpacity onPress={handleCadastro} style={{ width: "100%" }}>
          <LinearGradient colors={["#22c55e", "#16a34a"]} style={styles.button}>
            <Ionicons name="person-add-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Cadastrar</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.registerText}>
            Já tem conta? <Text style={{ fontWeight: "bold" }}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
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
