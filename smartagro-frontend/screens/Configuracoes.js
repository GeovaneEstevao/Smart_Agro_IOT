import React, { useEffect, useState } from "react";
import { View, Text, Switch, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";


const API_URL = "http://127.0.0.1:3000/api/configuracoes";

export default function Configuracoes() {
  const [notificacoes, setNotificacoes] = useState(true);
  const [modoEconomia, setModoEconomia] = useState(false);

  const userId = 1;


  const fetchConfiguracoes = async () => {
    try {
      const res = await fetch(`${API_URL}/${userId}`);
      const data = await res.json();

      if (res.ok && data) {
        setNotificacoes(data.notificacoes === 1);
        setModoEconomia(data.modo_economia === 1);
      } else {
        Alert.alert("Erro", "Não foi possível carregar configurações.");
      }
    } catch (err) {
      Alert.alert("Erro", "Falha ao conectar ao servidor.");
    }
  };


  const salvarConfiguracoes = async (novasConfigs) => {
    try {
      await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novasConfigs),
      });
    } catch (err) {
      Alert.alert("Erro", "Não foi possível salvar alterações.");
    }
  };


  useEffect(() => {
    fetchConfiguracoes();
  }, []);


  const toggleNotificacoes = () => {
    const novoValor = !notificacoes;
    setNotificacoes(novoValor);
    salvarConfiguracoes({ notificacoes: novoValor, modo_economia: modoEconomia });
  };


  const toggleModoEconomia = () => {
    const novoValor = !modoEconomia;
    setModoEconomia(novoValor);
    salvarConfiguracoes({ notificacoes, modo_economia: novoValor });
  };

  return (
    <LinearGradient colors={["#16a34a", "#15803d"]} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Configurações</Text>

        <View style={styles.itemCard}>
          <Text style={styles.itemText}>Notificações</Text>
          <Switch
            value={notificacoes}
            onValueChange={toggleNotificacoes}
            thumbColor={notificacoes ? "#16a34a" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#a7f3d0" }}
          />
        </View>

        <View style={styles.itemCard}>
          <Text style={styles.itemText}>Modo Economia de Água</Text>
          <Switch
            value={modoEconomia}
            onValueChange={toggleModoEconomia}
            thumbColor={modoEconomia ? "#16a34a" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#a7f3d0" }}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#f0fdf4",
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  itemText: {
    fontSize: 16,
    color: "#15803d",
  },
});
