import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import init from "mqtt"; 

export default function Telemetria() {
  const [dados, setDados] = useState({
    temp: "0.0",
    hum: "0.0",
    soil_pct: "0",
    water_pct: "0", // O HC-SR04 mede distância (podemos inverter para porcentagem ou mostrar em cm)
    pump: false,    // Mapeado para o estado do LED/Bomba do seu ESP32
    mode: "AUTO",   // Valor padrão fixo já que o ESP não envia o modo
  });

  const [statusConexao, setStatusConexao] = useState("Conectando...");

  useEffect(() => {
    const brokerUrl = "ws://10.44.1.35:9001"; 
    const clientId = "rn_smart_agro_" + Math.random().toString(16).substr(2, 8);

    console.log("Conectando ao Broker MQTT...");
    const client = init.connect(brokerUrl, { clientId });

    client.on("connect", () => {
      setStatusConexao("Conectado");
      console.log("Conectado ao MQTT!");
      
      // Se inscreve em todos os tópicos que o seu ESP32 publica
      client.subscribe("ifrn/SmartAgro/temperatura");
      client.subscribe("ifrn/SmartAgro/umidade_ar");
      client.subscribe("ifrn/SmartAgro/umidade_solo");
      client.subscribe("ifrn/SmartAgro/distancia_cm");
      client.subscribe("ifrn/SmartAgro/alerta");
    });

    client.on("message", (topic, message) => {
      const valor = message.toString();
      
      setDados((dadosAnteriores) => {
        switch (topic) {
          case "ifrn/SmartAgro/temperatura":
            return { ...dadosAnteriores, temp: valor };
          case "ifrn/SmartAgro/umidade_ar":
            return { ...dadosAnteriores, hum: valor };
          case "ifrn/SmartAgro/umidade_solo":
            return { ...dadosAnteriores, soil_pct: valor };
          case "ifrn/SmartAgro/distancia_cm":
            // O HC-SR04 dá a distância em cm. Vamos salvar direto no campo que era do reservatório.
            return { ...dadosAnteriores, water_pct: valor };
          case "ifrn/SmartAgro/alerta":
            // Se o alerta for "PROXIMO", consideramos a bomba/led ativa
            return { ...dadosAnteriores, pump: valor === "PROXIMO" };
          default:
            return dadosAnteriores;
        }
      });
    });

    client.on("error", (err) => {
      console.error("Erro MQTT:", err);
      setStatusConexao("Erro de Conexão");
    });

    client.on("close", () => {
      setStatusConexao("Desconectado");
    });

    // Limpa a conexão ao fechar o app/tela
    return () => {
      if (client) {
        client.end();
      }
    };
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
        <Text style={styles.subtitle}>Status Broker: {statusConexao}</Text>
        
        <View style={styles.grid}>
          {renderCard("thermometer-outline", "Temperatura", dados.temp, " °C")}
          {renderCard("water-outline", "Umidade Ar", dados.hum, " %")}
          {renderCard("leaf-outline", "Umidade do Solo", dados.soil_pct, " %")}
          {/* Mudado de % para cm já que o HC-SR04 mede distância livre até o sensor */}
          {renderCard("cube-outline", "Nível da Água", dados.water_pct, " cm")}
          {renderCard("power-outline", "Alerta / Bomba", dados.pump ? "Ligada" : "Desligada")}
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
    marginBottom: 5,
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#e2e8f0",
    marginBottom: 20,
    fontStyle: "italic",
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