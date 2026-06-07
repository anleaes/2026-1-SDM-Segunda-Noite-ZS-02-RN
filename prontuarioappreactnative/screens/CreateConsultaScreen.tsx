import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { BASE_URL } from "../config";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "CreateConsulta">;

const CreateConsultaScreen = ({ navigation }: Props) => {
  const [dataAgendada, setDataAgendada] = useState("");
  const [status, setStatus] = useState("");
  const [motivo, setMotivo] = useState("");
  const [nivelPrioridade, setNivelPrioridade] = useState("");
  const [pacienteId, setPacienteId] = useState("");
  const [medicoId, setMedicoId] = useState("");
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setDataAgendada("");
      setStatus("");
      setMotivo("");
      setNivelPrioridade("");
      setPacienteId("");
      setMedicoId("");
    }, []),
  );

  const handleSave = async () => {
    try {
      setSaving(true);
      await fetch(`${BASE_URL}/api/consultas/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data_agendada: dataAgendada,
          status: status,
          motivo: motivo,
          nivel_prioridade: nivelPrioridade,
          paciente: parseInt(pacienteId),
          medico: parseInt(medicoId),
        }),
      });
      navigation.navigate("Consultas");
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Data e Hora Agendada</Text>
      <TextInput
        value={dataAgendada}
        onChangeText={setDataAgendada}
        style={styles.input}
        placeholder="YYYY-MM-DD HH:MM"
      />

      <Text style={styles.label}>Status</Text>
      <TextInput value={status} onChangeText={setStatus} style={styles.input} />

      <Text style={styles.label}>Nível de Prioridade</Text>
      <TextInput
        value={nivelPrioridade}
        onChangeText={setNivelPrioridade}
        style={styles.input}
      />

      <Text style={styles.label}>ID do Paciente</Text>
      <TextInput
        value={pacienteId}
        onChangeText={setPacienteId}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>ID do Médico</Text>
      <TextInput
        value={medicoId}
        onChangeText={setMedicoId}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Motivo</Text>
      <TextInput
        value={motivo}
        onChangeText={setMotivo}
        style={[styles.input, { height: 100 }]}
        multiline
      />

      <View style={{ marginTop: 20, paddingBottom: 40 }}>
        {saving ? (
          <ActivityIndicator
            size="large"
            color="#4B7BE5"
            style={{ marginVertical: 10 }}
          />
        ) : (
          <TouchableOpacity style={styles.fullSaveButton} onPress={handleSave}>
            <Text style={styles.fullButtonText}>SALVAR</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.fullBackButton}
          onPress={() => navigation.navigate("Consultas")}
        >
          <Text style={styles.fullButtonText}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  label: { fontWeight: "600", marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 },
  fullSaveButton: {
    backgroundColor: "#4B7BE5",
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 2,
  },
  fullBackButton: {
    backgroundColor: "#2196F3",
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  fullButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});

export default CreateConsultaScreen;
