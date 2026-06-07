import { DrawerScreenProps } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
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

type Props = DrawerScreenProps<DrawerParamList, "EditConsulta">;

const EditConsultaScreen = ({ route, navigation }: Props) => {
  const { consulta } = route.params;

  const [dataAgendada, setDataAgendada] = useState(consulta.data_agendada);
  const [status, setStatus] = useState(consulta.status);
  const [motivo, setMotivo] = useState(consulta.motivo);
  const [nivelPrioridade, setNivelPrioridade] = useState(
    consulta.nivel_prioridade,
  );
  const [pacienteId, setPacienteId] = useState(String(consulta.paciente));
  const [medicoId, setMedicoId] = useState(String(consulta.medico));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDataAgendada(consulta.data_agendada);
    setStatus(consulta.status);
    setMotivo(consulta.motivo);
    setNivelPrioridade(consulta.nivel_prioridade);
    setPacienteId(String(consulta.paciente));
    setMedicoId(String(consulta.medico));
  }, [consulta]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await fetch(`${BASE_URL}/api/consultas/${consulta.id}/`, {
        method: "PUT",
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

export default EditConsultaScreen;
