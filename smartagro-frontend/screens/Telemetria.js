import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function Telemetria() {
  const [dados, setDados] = useState({
    temp: 0,
    hum: 0,
    soil_pct: 0,
    water_pct: 0,
    pump: false,
    mode: "auto",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDados({
        temp: (25 + Math.random() * 5).toFixed(1),
        hum: (50 + Math.random() * 10).toFixed(1),
        soil_pct: (30 + Math.random() * 20).toFixed(1),
        water_pct: (70 + Math.random() * 15).toFixed(1),
        pump: Math.random() > 0.5,
        mode: Math.random() > 0.5 ? "auto" : "manual",
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderCard = (icon, label, value, unit = "") => (
    <View style={styles.card} key={label}>
      <Ionicons name={icon} size={28} color="#16a34a" />
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}{unit}</Text>
    </View>
  );

  return (
    <LinearGradient colors={["#16a34a", "#15803d"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📡 Telemetria em Tempo Real</Text>
        <View style={styles.grid}>
          {renderCard("thermometer-outline", "Temperatura", dados.temp, " °C")}
          {renderCard("water-outline", "Umidade", dados.hum, " %")}
          {renderCard("leaf-outline", "Umidade do Solo", dados.soil_pct, " %")}
          {renderCard("cube-outline", "Reservatório", dados.water_pct, " %")}
          {renderCard("power-outline", "Bomba", dados.pump ? "Ligada" : "Desligada")}
          {renderCard("cog-outline", "Modo", dados.mode.toUpperCase())}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 20, alignItems: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    width: "45%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  cardLabel: { fontSize: 14, color: "#15803d", marginTop: 8 },
  cardValue: { fontSize: 18, fontWeight: "bold", color: "#15803d", marginTop: 5 },
});
