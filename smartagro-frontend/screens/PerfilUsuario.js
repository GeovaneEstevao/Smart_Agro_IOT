import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function PerfilUsuario() {
  return (
    <LinearGradient colors={["#16a34a", "#15803d"]} style={styles.gradient}>
      <View style={styles.container}>
        <Image
          source={require("../assets/smartagro.jpg")}
          style={styles.avatar}
        />
        <Text style={styles.name}>SmartAgro</Text>
        <Text style={styles.email}>SmartAgro@gmail.com</Text>

        <TouchableOpacity style={styles.buttonEdit}>
          <Ionicons name="create-outline" size={18} color="#15803d" />
          <Text style={styles.buttonTextEdit}>Editar Perfil</Text>
        </TouchableOpacity>

        
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    alignItems: "center",
    padding: 30,
    flex: 1,
    justifyContent: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  email: {
    color: "#f0fdf4",
    marginBottom: 30,
    fontSize: 14,
  },
  buttonEdit: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "80%",
    marginVertical: 10,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonTextEdit: {
    color: "#15803d",
    fontWeight: "bold",
    marginLeft: 6,
  },
  buttonLogout: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc2626",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "80%",
    justifyContent: "center",
  },
  buttonTextLogout: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
  },
});
