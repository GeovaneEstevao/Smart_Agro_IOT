import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const maxWidth = 480; // largura máxima para telas maiores

export default function SensorsScreen() {
  const [sensores, setSensores] = useState([
    { id: 1, nome: "Temperatura", unidade: "°C", valor: 28.5 },
    { id: 2, nome: "Umidade do Solo", unidade: "%", valor: 45 },
    { id: 3, nome: "Umidade do Ar", unidade: "%", valor: 65 },
    { id: 4, nome: "Nível de Água", unidade: "%", valor: 80 },
  ]);

  const [novoSensorNome, setNovoSensorNome] = useState("");
  const [novaUnidade, setNovaUnidade] = useState("");

  const adicionarSensor = () => {
    if (!novoSensorNome.trim() || !novaUnidade.trim()) {
      Alert.alert("Erro", "Informe nome e unidade do sensor.");
      return;
    }
    if (
      sensores.some(
        (s) => s.nome.toLowerCase() === novoSensorNome.trim().toLowerCase()
      )
    ) {
      Alert.alert("Erro", "Sensor já cadastrado.");
      return;
    }
    const novoSensor = {
      id: Date.now(),
      nome: novoSensorNome.trim(),
      unidade: novaUnidade.trim(),
      valor: "—",
    };
    setSensores((prev) => [...prev, novoSensor]);
    setNovoSensorNome("");
    setNovaUnidade("");
  };

  const removerSensor = (id) => {
    Alert.alert(
      "Remover Sensor",
      "Deseja remover este sensor?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => setSensores((prev) => prev.filter((s) => s.id !== id)),
        },
      ]
    );
  };

  return (
    <LinearGradient colors={["#16a34a", "#15803d"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Sensores do Sistema</Text>

          {sensores.length === 0 && (
            <Text style={styles.emptyText}>Nenhum sensor cadastrado.</Text>
          )}

          {sensores.map(({ id, nome, unidade, valor }) => (
            <View key={id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.label}>{nome}</Text>
                  <Text style={styles.value}>
                    {valor} {unidade}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removerSensor(id)}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={styles.form}>
            <Text style={styles.formTitle}>Adicionar Novo Sensor</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do Sensor"
              placeholderTextColor="#9ca3af"
              value={novoSensorNome}
              onChangeText={setNovoSensorNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Unidade (ex: °C, %)"
              placeholderTextColor="#9ca3af"
              value={novaUnidade}
              onChangeText={setNovaUnidade}
            />
            <TouchableOpacity style={styles.addButton} onPress={adicionarSensor}>
              <Text style={styles.addButtonText}>Adicionar Sensor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    paddingVertical: 30,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  content: {
    width: "100%",
    maxWidth: maxWidth,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#f0fdf4",
    marginBottom: 20,
    textAlign: "center",
  },
  emptyText: {
    color: "#d1d5db",
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    color: "#15803d",
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#16a34a",
    marginTop: 6,
    fontWeight: "700",
  },
  removeButton: {
    backgroundColor: "#dc2626",
    padding: 8,
    borderRadius: 8,
  },
  form: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginTop: 30,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#15803d",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#111",
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
