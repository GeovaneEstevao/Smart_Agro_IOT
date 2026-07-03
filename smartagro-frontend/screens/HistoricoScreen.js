import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";


const API_URL = "http://127.0.0.1:3000/api/historico";

export default function HistoryScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = 1;

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const res = await fetch(`${API_URL}/${userId}`);
        const data = await res.json();
        setHistorico(data);
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  const filtrarPorData = (lista) => {
    if (filter === "7days") return lista.slice(0, 3);
    if (filter === "30days") return lista.slice(0, 5);
    return lista;
  };

  const filtrarPorBusca = (lista) =>
    lista.filter((item) =>
      item.acao.toLowerCase().includes(search.toLowerCase())
    );

  const historicoFiltrado = filtrarPorBusca(filtrarPorData(historico));

  return (
    <LinearGradient colors={["#16a34a", "#15803d"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Histórico Completo</Text>

        {/* Barra de busca */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por ação..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filtros */}
        <View style={styles.filterContainer}>
          {["all", "7days", "30days"].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.filterButton,
                filter === opt && styles.filterActive,
              ]}
              onPress={() => setFilter(opt)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === opt && styles.filterTextActive,
                ]}
              >
                {opt === "all" ? "Todos" : opt === "7days" ? "7 dias" : "30 dias"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conteúdo */}
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : historicoFiltrado.length > 0 ? (
          historicoFiltrado.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.date}>{item.data}</Text>
              <Text style={styles.action}>{item.acao}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum resultado encontrado.</Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchInput: { flex: 1, padding: 10, fontSize: 14 },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  filterButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 2,
  },
  filterActive: { backgroundColor: "#16a34a" },
  filterText: { color: "#111", fontWeight: "bold" },
  filterTextActive: { color: "#fff" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  date: { fontSize: 12, color: "#6b7280", marginBottom: 5 },
  action: { fontSize: 15, fontWeight: "500", color: "#15803d" },
  emptyText: { marginTop: 20, textAlign: "center", color: "#fff" },
});
