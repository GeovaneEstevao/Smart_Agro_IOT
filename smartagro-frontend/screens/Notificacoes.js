import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const notificacoes = [
  { id: "1", mensagem: "Umidade do solo abaixo do mínimo!" },
  { id: "2", mensagem: "Bomba ativada automaticamente." },
  { id: "3", mensagem: "Temperatura acima do ideal." },
];

export default function Notificacoes() {
  return (
    <LinearGradient colors={["#16a34a", "#15803d"]} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Notificações</Text>
        <FlatList
          data={notificacoes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.item}>• {item.mensagem}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#f0fdf4",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  item: {
    fontSize: 16,
    color: "#15803d",
  },
});
