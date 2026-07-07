import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
// Certifique-se de ter instalado com: npm install mqtt
import init from "mqtt"; 

export default function Telemetria() {
  const [clientMqtt, setClientMqtt] = useState(null); // Armazena o cliente MQTT para envio de dados

  const [dados, setDados] = useState({
    temp: "---",
    hum: "---",
    soil_pct: "---",
    water_pct: "---",
    pump: false, // Estado do relé/bomba: false = Desligado, true = Ligado
    mode: "AUTO",
  });

  const [statusConexao, setStatusConexao] = useState("Iniciando...");

  useEffect(() => {
    const brokerUrl = "ws://10.44.1.35:9001"; 
    const clientId = "rn_pc_agro_" + Math.random().toString(16).substring(2, 10);

    console.log(`[Front-End] Tentando conectar via WebSocket em: ${brokerUrl}`);
    setStatusConexao("Conectando ao Broker...");

    const client = init.connect(brokerUrl, { 
      clientId,
      connectTimeout: 5000,
      reconnectPeriod: 2000
    });

    setClientMqtt(client);

    client.on("connect", () => {
      setStatusConexao("Conectado ao Broker");
      console.log("%c[MQTT] SUCESSO: Conectado com o Broker no PC!", "color: #4ade80; font-weight: bold;");
      client.subscribe("ifrn/SmartAgro/#", (err) => {
        if (!err) {
          console.log("[MQTT] Escutando todos os tópicos do SmartAgro.");
        }
      });
    });

    client.on("message", (topic, message) => {
      const valor = message.toString();

      console.log(`📡 [DADO REAL DO ESP] Tópico: ${topic} | Valor: ${valor}`);

      setDados((dadosAnteriores) => {
        switch (topic) {
          case "ifrn/SmartAgro/temperatura":
            return { ...dadosAnteriores, temp: valor };
          case "ifrn/SmartAgro/umidade_ar":
            return { ...dadosAnteriores, hum: valor };
          case "ifrn/SmartAgro/umidade_solo":
            return { ...dadosAnteriores, soil_pct: valor };
          case "ifrn/SmartAgro/distancia_cm":
            return { ...dadosAnteriores, water_pct: valor };
          case "ifrn/SmartAgro/bomba": // Escuta o retorno de status do relé físico
          case "ifrn/SmartAgro/rele":
            return { ...dadosAnteriores, pump: valor === "ON" };
          case "ifrn/SmartAgro/alerta":
            return { ...dadosAnteriores, pump: valor === "PROXIMO" };
          default:
            return dadosAnteriores;
        }
      });
    });

    client.on("error", (err) => {
      console.error("[MQTT] Erro detectado no front-end:", err);
      setStatusConexao("Erro na conexão");
    });

    client.on("close", () => {
      setStatusConexao("Desconectado do Broker");
    });

    return () => {
      if (client) client.end();
    };
  }, []);

  const alternarBomba = () => {
  if (!clientMqtt || statusConexao !== "Conectado ao Broker") return;

  const novoEstado = !dados.pump;
  
  // ALGUNS RELÉS SÓ ACEITAM "0" (LIGAR) E "1" (DESLIGAR) NO MQTT
  const comando = novoEstado ? "0" : "1"; 

  clientMqtt.publish("ifrn/SmartAgro/bomba", comando, { qos: 1 });
  
  setDados((ant) => ({ ...ant, pump: novoEstado }));
};

  const renderCard = (icon, label, value, unit = "") => (
    <View style={styles.card} key={label}>
      <Ionicons name={icon} size={28} color="#16a34a" />
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>
        {value}
        {value !== "---" && value !== "Erro" ? unit : ""}
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={["#16a34a", "#15803d"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📡 Telemetria</Text>
        
        <View style={styles.statusBadge}>
          {statusConexao === "Conectado ao Broker" ? (
            <View style={[styles.dot, { backgroundColor: '#4ade80' }]} />
          ) : (
            <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
          )}
          <Text style={styles.subtitle}>{statusConexao}</Text>
        </View>
        
        <View style={styles.grid}>
          {renderCard("thermometer-outline", "Temperatura", dados.temp, " °C")}
          {renderCard("water-outline", "Umidade Ar", dados.hum, " %")}
          {renderCard("leaf-outline", "Umidade Solo", dados.soil_pct, " %")}
          {renderCard("cube-outline", "Distância", dados.water_pct, " cm")}
          
          {/* COMPONENTE INTERATIVO DO RELÉ (ALTERA A BORDA E O ÍCONE) */}
          <TouchableOpacity 
            style={[
              styles.card, 
              dados.pump ? styles.cardPumpOn : styles.cardPumpOff
            ]} 
            onPress={alternarBomba}
            activeOpacity={0.7}
          >
            {/* O ícone muda de cor junto com o acionamento do relé físico */}
            <Ionicons 
              name="power-outline" 
              size={28} 
              color={dados.pump ? "#16a34a" : "#dc2626"} 
            />
            <Text style={styles.cardLabel}>Bomba / Relé</Text>
            
            {/* O texto exibe o status e muda a cor para casar com o LED do módulo */}
            <Text style={[styles.cardValue, dados.pump ? styles.textGreen : styles.textRed]}>
              {dados.pump ? "Ligada 🟢" : "Desligada 🔴"}
            </Text>
          </TouchableOpacity>

          {renderCard("cog-outline", "Modo", dados.mode.toUpperCase())}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 20, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", textAlign: "center", marginTop: 10 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  subtitle: { fontSize: 13, color: "#fff", fontWeight: "500" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: "100%" },
  card: {
    width: "45%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  
  // ESTILOS DE COR DA LUZ DO COMPONENTE DO RELÉ
  cardPumpOn: {
    backgroundColor: "#fff",
    borderColor: "#16a34a", // Contorno verde ao ligar
  },
  cardPumpOff: {
    backgroundColor: "#fff",
    borderColor: "#dc2626", // Contorno vermelho ao desligar
  },
  cardLabel: { fontSize: 13, color: "#4b5563", marginTop: 8 },
  cardValue: { fontSize: 18, fontWeight: "bold", marginTop: 5 },
  
  // Cores dinâmicas para o texto de status
  textGreen: { color: "#16a34a" },
  textRed: { color: "#dc2626" },
});