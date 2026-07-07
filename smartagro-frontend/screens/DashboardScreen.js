import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { API_URL } from "../config";

export default function DashboardScreen({ navigation }) {
  const [leituras, setLeituras] = useState([]);

  useEffect(() => {
    let active = true;

    const carregarDados = async () => {
      try {
        const response = await fetch(`${API_URL}/sensores/atual`);
        const data = await response.json();

        if (!active) return;

        const leituraAtual = [{
          data: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          umidade: Number(data?.umidade?.valor ?? 0),
          temperatura: Number(data?.temperatura?.valor ?? 0),
          nivelAgua: Number(data?.nivel_agua?.valor ?? 0),
        }];

        setLeituras(leituraAtual);
      } catch (error) {
        console.warn("Erro ao buscar leituras do backend", error);
      }
    };

    carregarDados();
    const intervalId = setInterval(carregarDados, 5000);
    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  const menuItems = [
    { icon: "speedometer-outline", title: "Telemetria", screen: "Telemetria" },
    { icon: "hardware-chip-outline", title: "Controle", screen: "Controle" },
    { icon: "notifications-outline", title: "Notificações", screen: "Notificacoes" },
    { icon: "settings-outline", title: "Configurações", screen: "Configuracoes" },
    { icon: "time-outline", title: "Historico", screen: "Historico" },
    { icon: "water-outline", title: "Irrigação", screen: "Irrigacao" },
    { icon: "leaf-outline", title: "Sensores", screen: "Sensores" },
    { icon: "person-circle-outline", title: "Perfil", screen: "PerfilUsuario" },
  ];

  return (
    <LinearGradient colors={["#16a34a", "#15803d"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.welcome}>Olá, Bem-vindo!</Text>
        <Text style={styles.subtitle}>Resumo do seu sistema</Text>

        {/* Menu em Grid */}
        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Ionicons name={item.icon} size={28} color="#16a34a" />
              <Text style={styles.cardText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Gráfico de Umidade */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Variação de Umidade (%)</Text>
          {leituras.length > 0 ? (
            <LineChart
              data={{
                labels: leituras.map((l) => l.data),
                datasets: [{ data: leituras.map((l) => l.umidade) }],
              }}
              width={Dimensions.get("window").width - 40}
              height={220}
              yAxisSuffix="%"
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#f0fdf4",
                backgroundGradientTo: "#bbf7d0",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(22, 163, 74, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 12 },
              }}
              style={{ borderRadius: 12 }}
            />
          ) : (
            <Text style={styles.emptyText}>Aguardando primeiras leituras do ESP32...</Text>
          )}
        </View>

        {/* Últimas Leituras */}
        <View style={styles.readingsContainer}>
          <Text style={styles.sectionTitle}>Últimas Leituras</Text>
          {leituras.length > 0 ? leituras.map((item, i) => (
            <View key={i} style={styles.readingItem}>
              <Text style={styles.readingText}>{item.data}</Text>
              <Text style={styles.readingText}>🌡 {item.temperatura}°C</Text>
              <Text style={styles.readingText}>💧 {item.umidade}%</Text>
              <Text style={styles.readingText}>💦 {item.nivelAgua}%</Text>
            </View>
          )) : (
            <Text style={styles.emptyText}>Nenhuma leitura recebida ainda.</Text>
          )}
        </View>

        {/* Botão Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate("Login")}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 20, alignItems: "center" },
  welcome: { fontSize: 26, color: "#fff", fontWeight: "bold", marginTop: 20 },
  subtitle: { fontSize: 16, color: "#f0fdf4", marginBottom: 20 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  card: {
    width: "45%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  cardText: { marginTop: 8, fontSize: 14, fontWeight: "bold", color: "#15803d", textAlign: "center" },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    width: "100%",
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#15803d", marginBottom: 10 },
  emptyText: { fontSize: 14, color: "#6b7280", marginTop: 6 },
  readingsContainer: { backgroundColor: "#fff", borderRadius: 12, padding: 10, width: "100%", marginBottom: 20 },
  readingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 5,
  },
  readingText: { fontSize: 14, color: "#333" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 5 },
});
