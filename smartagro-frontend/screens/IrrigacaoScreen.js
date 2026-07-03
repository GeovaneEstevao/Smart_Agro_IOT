import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function IrrigationScreen() {
  const [bombaLigada, setBombaLigada] = useState(false);
  const [modoAutomatico, setModoAutomatico] = useState(true);

  const handleToggleBomba = () => {
    if (modoAutomatico) {
      return Alert.alert(
        "Modo Automático",
        "Desative o modo automático para controlar manualmente a irrigação."
      );
    }

    const novaAcao = !bombaLigada;
    setBombaLigada(novaAcao);

    Alert.alert(
      "Irrigação",
      novaAcao ? "Irrigação iniciada com sucesso." : "Irrigação desligada.",
      [{ text: "OK" }]
    );
  };

  const handleToggleModo = () => {
    const novoModo = !modoAutomatico;
    setModoAutomatico(novoModo);
    setBombaLigada(false);

    Alert.alert(
      "Modo de Irrigação",
      novoModo ? "Modo Automático ativado." : "Modo Manual ativado.",
      [{ text: "OK" }]
    );
  };

  return (
    <LinearGradient colors={["#16a34a", "#15803d"]} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Controle de Irrigação</Text>

        {/* Status da bomba */}
        <View style={styles.statusCard}>
          <Ionicons
            name={bombaLigada ? "water" : "water-outline"}
            size={100}
            color={bombaLigada ? "#16a34a" : "#9ca3af"}
            style={styles.icon}
          />
          <Text
            style={[
              styles.statusText,
              { color: bombaLigada ? "#16a34a" : "#6b7280" },
            ]}
          >
            {bombaLigada ? "Bomba Ligada" : "Bomba Desligada"}
          </Text>
          <Text style={styles.modeText}>
            Modo atual:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {modoAutomatico ? "Automático" : "Manual"}
            </Text>
          </Text>
        </View>

        {/* Botão principal */}
        <TouchableOpacity
          style={[
            styles.controlButton,
            modoAutomatico
              ? styles.disabledButton
              : bombaLigada
              ? styles.stopButton
              : styles.startButton,
          ]}
          onPress={handleToggleBomba}
          disabled={modoAutomatico}
        >
          <Text style={styles.controlButtonText}>
            {modoAutomatico
              ? "Controle Manual Desativado"
              : bombaLigada
              ? "Desligar Irrigação"
              : "Ligar Irrigação"}
          </Text>
        </TouchableOpacity>

        {/* Trocar modo */}
        <TouchableOpacity style={styles.modeToggleButton} onPress={handleToggleModo}>
          <Ionicons
            name={modoAutomatico ? "hand-left-outline" : "refresh-circle"}
            size={22}
            color="#15803d"
          />
          <Text style={styles.modeToggleText}>
            {modoAutomatico ? "Ativar Modo Manual" : "Ativar Modo Automático"}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  statusCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    padding: 20,
    marginBottom: 40,
    elevation: 4,
  },
  icon: {
    marginBottom: 10,
  },
  statusText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modeText: {
    fontSize: 16,
    color: "#15803d",
  },
  controlButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: "#16a34a",
  },
  stopButton: {
    backgroundColor: "#dc2626",
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  controlButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modeToggleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 2,
  },
  modeToggleText: {
    color: "#15803d",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
