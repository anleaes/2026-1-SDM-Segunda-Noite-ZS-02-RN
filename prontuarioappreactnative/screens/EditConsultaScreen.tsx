import { Picker } from "@react-native-picker/picker";
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
  // O uso do 'any' aqui é o truque cirúrgico para o TypeScript aceitar o objeto vindo do Django
  // com dados aninhados sem pintar a linha de vermelho no VS Code.
  const consulta = route.params?.consulta as any;

  const [dataAgendada, setDataAgendada] = useState("");
  const [status, setStatus] = useState("");
  const [motivo, setMotivo] = useState("");
  const [nivelPrioridade, setNivelPrioridade] = useState("");

  const [pacienteId, setPacienteId] = useState<number | undefined>(undefined);
  const [medicoId, setMedicoId] = useState<number | undefined>(undefined);

  const [saving, setSaving] = useState(false);

  const [listaPacientes, setListaPacientes] = useState<any[]>([]);
  const [listaMedicos, setListaMedicos] = useState<any[]>([]);

  // Carrega as listas apontando para os caminhos corretos no singular do teu backend
  useEffect(() => {
    fetch(`${BASE_URL}/paciente/api/`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro HTTP: " + res.status);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setListaPacientes(data);
        } else if (data.results && Array.isArray(data.results)) {
          setListaPacientes(data.results);
        } else {
          setListaPacientes(data.data || []);
        }
      })
      .catch((err) => console.log("Erro ao buscar paciente:", err));

    fetch(`${BASE_URL}/medico/api/`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro HTTP: " + res.status);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setListaMedicos(data);
        } else if (data.results && Array.isArray(data.results)) {
          setListaMedicos(data.results);
        } else {
          setListaMedicos(data.data || []);
        }
      })
      .catch((err) => console.log("Erro ao buscar medico:", err));
  }, []);

  useEffect(() => {
    if (consulta) {
      if (consulta.data_agendada) {
        setDataAgendada(
          consulta.data_agendada.replace("T", " ").substring(0, 16),
        );
      }

      setStatus(consulta.status || "");
      setMotivo(consulta.motivo || "");
      setNivelPrioridade(consulta.nivel_prioridade || "");

      const pId =
        typeof consulta.paciente === "object"
          ? consulta.paciente.id
          : consulta.paciente;
      const mId =
        typeof consulta.medico === "object"
          ? consulta.medico.id
          : consulta.medico;

      setPacienteId(pId ? Number(pId) : undefined);
      setMedicoId(mId ? Number(mId) : undefined);
    }
  }, [consulta]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const dataFormatadaDjango = dataAgendada.trim().replace(" ", "T");

      const response = await fetch(
        `${BASE_URL}/consultas/api/${consulta.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data_agendada: dataFormatadaDjango,
            status: status,
            motivo: motivo,
            nivel_prioridade: nivelPrioridade,
            paciente: pacienteId,
            medico: medicoId,
          }),
        },
      );

      if (!response.ok) {
        const errJson = await response.json();
        alert("Erro no Django ao atualizar: " + JSON.stringify(errJson));
        return;
      }

      navigation.navigate("Consultas");
    } catch (error) {
      console.log("Erro ao salvar edição:", error);
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
          <Picker.Item label="Agendada" value="Agendada" />
          <Picker.Item label="Realizada" value="Realizada" />
          <Picker.Item label="Cancelada" value="Cancelada" />
        </Picker>
      </View>

      <Text style={styles.label}>Nível de Prioridade</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={nivelPrioridade}
          onValueChange={(itemValue) => setNivelPrioridade(itemValue)}
          style={styles.pickerInternal}
        >
          <Picker.Item label="Baixa" value="Baixa" />
          <Picker.Item label="Normal" value="Normal" />
          <Picker.Item label="Alta" value="Alta" />
          <Picker.Item label="Urgência" value="Urgência" />
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
          <Picker.Item label="----------" value={undefined} />
          {listaPacientes.map((item) => (
            <Picker.Item
              key={item.id}
              label={
                item.nome ||
                item.nome_completo ||
                item.first_name ||
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
          <Picker.Item label="----------" value={undefined} />
          {listaMedicos.map((item) => (
            <Picker.Item
              key={item.id}
              label={
                item.nome ||
                item.nome_completo ||
                item.first_name ||
                item.user?.first_name ||
                `ID: ${item.id}`
              }
              value={item.id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Motivo da Consulta</Text>
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

export default EditConsultaScreen;
