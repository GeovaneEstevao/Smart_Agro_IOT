import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import init from "mqtt";

const MQTT_BROKER_WS = "ws://10.44.1.35:9001"; 
const TOPIC_TEMPERATURA = "ifrn/SmartAgro/temperatura";
const TOPIC_UMIDADE_AR = "ifrn/SmartAgro/umidade_ar";
const TOPIC_DISTANCIA_CM = "ifrn/SmartAgro/distancia_cm";

export default function DashboardScreen({ navigation }) {
  // Estado que armazena o histórico unificado (limitado a 3 no componente visual)
  const [leituras, setLeituras] = useState([
    { data: "Agora", umidade: 0, temperatura: 0, distancia: 0 }
  ]);

  // Valores em tempo real compartilhados
  const [tempAtual, setTempAtual] = useState(0);
  const [umidAtual, setUmidAtual] = useState(0);
  const [distAtual, setDistAtual] = useState(0);

  useEffect(() => {
    const client = init.connect(MQTT_BROKER_WS, {
      clientId: `mobile_client_${Math.random().toString(16).substr(2, 8)}`
    });

    client.on("connect", () => {
      console.log("Conectado ao Broker MQTT com sucesso!");
      client.subscribe(TOPIC_TEMPERATURA);
      client.subscribe(TOPIC_UMIDADE_AR);
      client.subscribe(TOPIC_DISTANCIA_CM);
    });

    client.on("message", (topic, message) => {
      const valor = parseFloat(message.toString());
      const horaAtual = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

      if (isNaN(valor)) return;

      if (topic === TOPIC_TEMPERATURA) {
        setTempAtual(valor);
        atualizarHistorico(horaAtual, valor, umidAtual, distAtual);
      } else if (topic === TOPIC_UMIDADE_AR) {
        setUmidAtual(valor);
        atualizarHistorico(horaAtual, tempAtual, valor, distAtual);
      } else if (topic === TOPIC_DISTANCIA_CM) {
        setDistAtual(valor);
        atualizarHistorico(horaAtual, tempAtual, umidAtual, valor);
      }
    });

    const atualizarHistorico = (hora, t, u, d) => {
      setLeituras((prev) => {
        const novaLeitura = { data: hora, temperatura: t, umidade: u, distancia: d };
        // Guarda até 5 pontos internamente para renderizar melhor o gráfico de linha
        return [novaLeitura, ...prev].slice(0, 5);
      });
    };

    client.on("error", (err) => console.error("Erro MQTT: ", err));

    return () => {
      if (client) client.end();
    };
  }, [tempAtual, umidAtual, distAtual]);

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

  // Dados ordenados cronologicamente da esquerda para a direita para os gráficos
  const dadosGrafico = [...leituras].reverse();
  
  // Limita estritamente às 3 últimas leituras para a lista inferior
  const ultimasTresLeituras = leituras.slice(0, 3);

  // Configuração visual padrão dos gráficos com margem de segurança (paddingRight) incorporada
  const baseChartConfig = (fromColor, toColor, lineRGB, paddingRightValue = 45) => ({
    backgroundColor: "#fff",
    backgroundGradientFrom: fromColor,
    backgroundGradientTo: toColor,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(${lineRGB}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 12 },
    paddingRight: paddingRightValue, // Abre espaço interno para os textos do eixo Y não cortarem
    propsForLabels: { translateX: -5 }
  });

  return (
    <LinearGradient colors={["#16a34a", "#15803d"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.welcome}>Olá, Bem-vindo!</Text>
        <Text style={styles.subtitle}>Painel SmartAgro em Tempo Real</Text>

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

        {/* Gráfico 1: Temperatura */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Variação de Temperatura (°C)</Text>
          <LineChart
            data={{
              labels: dadosGrafico.map(l => l.data),
              datasets: [{ data: dadosGrafico.map(l => l.temperatura) }],
            }}
            width={Dimensions.get("window").width - 60} // Margem segura para não vazar o componente pai
            height={180}
            yAxisSuffix="°C"
            chartConfig={baseChartConfig("#fef2f2", "#fee2e2", "239, 68, 68", 45)}
            style={styles.chartStyle}
          />
        </View>

        {/* Gráfico 2: Umidade */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Variação de Umidade (%)</Text>
          <LineChart
            data={{
              labels: dadosGrafico.map(l => l.data),
              datasets: [{ data: dadosGrafico.map(l => l.umidade) }],
            }}
            width={Dimensions.get("window").width - 60}
            height={180}
            yAxisSuffix="%"
            chartConfig={baseChartConfig("#f0fdf4", "#bbf7d0", "22, 163, 74", 45)}
            style={styles.chartStyle}
          />
        </View>

        {/* Gráfico 3: Distância */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Nível / Distância (cm)</Text>
          <LineChart
            data={{
              labels: dadosGrafico.map(l => l.data),
              datasets: [{ data: dadosGrafico.map(l => l.distancia) }],
            }}
            width={Dimensions.get("window").width - 60}
            height={180}
            yAxisSuffix=" cm"
            chartConfig={baseChartConfig("#eff6ff", "#dbeafe", "59, 130, 246", 55)} // Mais padding pois "cm" ocupa mais espaço
            style={styles.chartStyle}
          />
        </View>

        {/* Últimas 3 Leituras */}
        <View style={styles.readingsContainer}>
          <Text style={styles.sectionTitle}>Últimas 3 Leituras</Text>
          {ultimasTresLeituras.map((item, i) => (
            <View key={i} style={styles.readingItem}>
              <Text style={styles.readingTime}>{item.data}</Text>
              <View style={styles.readingRow}>
                <Text style={styles.readingText}>🌡 {item.temperatura.toFixed(1)}°C</Text>
                <Text style={styles.readingText}>💧 {item.umidade.toFixed(0)}%</Text>
                <Text style={styles.readingText}>📏 {item.distancia.toFixed(1)}cm</Text>
              </View>
            </View>
          ))}
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
    padding: 15,
    width: "100%",
    marginBottom: 20,
    overflow: "hidden",   // Força o corte visual se algum elemento tentar ultrapassar o card
    alignItems: "center", // Mantém o gráfico centralizado perfeitamente
  },
  chartStyle: {
    borderRadius: 12,
    marginRight: 15, // Empurra o SVG um pouco para a esquerda neutralizando rebarbas
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#15803d", marginBottom: 10 },
  readingsContainer: { backgroundColor: "#fff", borderRadius: 12, padding: 15, width: "100%", marginBottom: 20 },
  readingItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
  },
  readingTime: { fontSize: 12, fontWeight: "bold", color: "#6b7280", marginBottom: 4 },
  readingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  readingText: { fontSize: 14, color: "#333", fontWeight: "500" },
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