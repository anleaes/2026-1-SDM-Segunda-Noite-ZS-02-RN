import { Picker } from "@react-native-picker/picker";
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

import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "CreateConsulta">;

const CreateConsultaScreen = ({ navigation }: Props) => {
  const [dataAgendada, setDataAgendada] = useState("");
  // Valores iniciais alterados para corresponderem às chaves do Django
  const [status, setStatus] = useState("AG");
  const [motivo, setMotivo] = useState("");
  const [nivelPrioridade, setNivelPrioridade] = useState("N");

  const [pacienteId, setPacienteId] = useState<number | undefined>(undefined);
  const [medicoId, setMedicoId] = useState<number | undefined>(undefined);

  const [saving, setSaving] = useState(false);

  const [listaPacientes, setListaPacientes] = useState<any[]>([]);
  const [listaMedicos, setListaMedicos] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      setDataAgendada("");
      // Reseta para os valores corretos
      setStatus("AG");
      setMotivo("");
      setNivelPrioridade("N");
      setPacienteId(undefined);
      setMedicoId(undefined);

      fetch(`http://127.0.0.1:8000/paciente/api/`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setListaPacientes(data);
          else setListaPacientes(data.results || data.data || []);
        })
        .catch((err) => console.log("Erro paciente:", err));

      fetch(`http://127.0.0.1:8000/medico/api/`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setListaMedicos(data);
          else setListaMedicos(data.results || data.data || []);
        })
        .catch((err) => console.log("Erro medico:", err));
    }, []),
  );

  const handleSave = async () => {
    if (!pacienteId || !medicoId) {
      alert("Por favor, selecione o paciente e o médico.");
      return;
    }

    try {
      setSaving(true);
      const dataFormatadaDjango = dataAgendada.trim().replace(" ", "T");

      const response = await fetch(`http://127.0.0.1:8000/consulta/api/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data_agendada: dataFormatadaDjango,
          status: status,
          motivo: motivo,
          nivel_prioridade: nivelPrioridade,
          paciente: pacienteId,
          medico: medicoId,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        alert("Erro ao criar consulta: " + JSON.stringify(errJson));
        return;
      }

      navigation.navigate("Consultas");
    } catch (error) {
      console.log(error);
      alert("Erro de conexão ao salvar.");
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
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
          style={styles.pickerInternal}
        >
          {/* Values atualizados com as siglas do Django */}
          <Picker.Item label="Agendada" value="AG" />
          <Picker.Item label="Realizada" value="RE" />
          <Picker.Item label="Cancelada" value="CA" />
        </Picker>
      </View>

      <Text style={styles.label}>Nível de Prioridade</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={nivelPrioridade}
          onValueChange={(itemValue) => setNivelPrioridade(itemValue)}
          style={styles.pickerInternal}
        >
          {/* Values atualizados com as siglas do Django */}
          <Picker.Item label="Baixa" value="B" />
          <Picker.Item label="Normal" value="N" />
          <Picker.Item label="Alta" value="A" />
          <Picker.Item label="Urgência" value="U" />
        </Picker>
      </View>

      <Text style={styles.label}>Paciente</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={pacienteId}
          onValueChange={(itemValue) =>
            setPacienteId(itemValue ? Number(itemValue) : undefined)
          }
          style={styles.pickerInternal}
        >
          <Picker.Item label="Selecione um paciente..." value={undefined} />
          {listaPacientes.map((item) => (
            <Picker.Item
              key={item.id}
              label={
                item.nome ||
                item.nome_completo ||
                item.user?.first_name ||
                `ID: ${item.id}`
              }
              value={item.id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Médico</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={medicoId}
          onValueChange={(itemValue) =>
            setMedicoId(itemValue ? Number(itemValue) : undefined)
          }
          style={styles.pickerInternal}
        >
          <Picker.Item label="Selecione um médico..." value={undefined} />
          {listaMedicos.map((item) => (
            <Picker.Item
              key={item.id}
              label={
                item.nome ||
                item.nome_completo ||
                item.user?.first_name ||
                `ID: ${item.id}`
              }
              value={item.id}
            />
          ))}
        </Picker>
      </View>

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
  label: { fontWeight: "600", marginTop: 12, marginBottom: 4, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    color: "#000",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 5,
    overflow: "hidden",
  },
  pickerInternal: {
    height: 45,
    width: "100%",
    color: "#000",
    backgroundColor: "#fff",
    padding: 10,
    borderWidth: 0,
  },
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
