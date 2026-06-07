import { Ionicons } from "@expo/vector-icons";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "Anamnese">;

export type Anamnese = {
  id: number;
  data_criacao: string;
  alergias: string;
  alcool: string;
  fumante: string;
  medicamentos: string;
  queixa_principal: string;
  paciente: number;
  medico: number;
};

const AnamneseScreen = ({ navigation }: Props) => {
  const [anamneses, setAnamneses] = useState<Anamnese[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDados = async () => {
    setLoading(true);

    // Busca as anamneses, pacientes e médicos ao mesmo tempo
    const [resAnamneses, resPacientes, resMedicos] = await Promise.all([
      fetch("http://127.0.0.1:8000/anamnese/api/"),
      fetch("http://127.0.0.1:8000/paciente/api/"),
      fetch("http://127.0.0.1:8000/medico/api/"),
    ]);

    const dataAnamneses = await resAnamneses.json();
    const dataPacientes = await resPacientes.json();
    const dataMedicos = await resMedicos.json();

    // Salva os dados nos estados (com suporte a paginação do DRF, se houver)
    setAnamneses(dataAnamneses.results || dataAnamneses);
    setPacientes(dataPacientes.results || dataPacientes);
    setMedicos(dataMedicos.results || dataMedicos);

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchDados();
    }, []),
  );

  const handleDelete = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/anamnese/api/${id}/`, {
      method: "DELETE",
    });

    setAnamneses((prev) => prev.filter((a) => a.id !== id));
  };

  // Funções para pegar o nome através do ID
  const getNomePaciente = (id: number) => {
    const paciente = pacientes.find((p) => p.id === id);
    return paciente ? paciente.nome : "Desconhecido";
  };

  const getNomeMedico = (id: number) => {
    const medico = medicos.find((m) => m.id === id);
    return medico ? medico.nome : "Desconhecido";
  };

  const renderItem = ({ item }: { item: Anamnese }) => {
    const dataFormatada = new Date(item.data_criacao).toLocaleDateString(
      "pt-BR",
    );

    return (
      <View style={styles.card}>
        <Text style={styles.name}>Anamnese de {dataFormatada}</Text>

        {/* Aqui os nomes são exibidos em vez dos IDs */}
        <Text style={styles.description}>
          Paciente: {getNomePaciente(item.paciente)} | Médico:{" "}
          {getNomeMedico(item.medico)}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          Queixa: {item.queixa_principal}
        </Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("EditAnamnese", { anamnese: item })
            }
          >
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.editText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anamneses</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={anamneses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateAnamnese")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#f0f4ff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "600", color: "#222" },
  description: { fontSize: 14, color: "#666", marginTop: 4 },
  row: { flexDirection: "row", marginTop: 10, alignSelf: "flex-end" },
  editButton: {
    backgroundColor: "#4B7BE5",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: { backgroundColor: "#E54848", padding: 8, borderRadius: 6 },
  editText: { color: "#fff", fontWeight: "500" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#0D47A1",
    borderRadius: 28,
    padding: 14,
    elevation: 4,
  },
});

export default AnamneseScreen;
