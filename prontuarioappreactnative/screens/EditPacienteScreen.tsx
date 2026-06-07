import { DrawerScreenProps } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "EditPaciente">;

const EditPacienteScreen = ({ route, navigation }: Props) => {
  const { paciente } = route.params;

  const [nome, setNome] = useState(paciente.nome);
  const [dataNascimento, setDataNascimento] = useState(
    paciente.data_nascimento,
  );
  const [peso, setPeso] = useState(String(paciente.peso));
  const [altura, setAltura] = useState(String(paciente.altura));
  const [endereco, setEndereco] = useState(paciente.endereco);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNome(paciente.nome);
    setDataNascimento(paciente.data_nascimento);
    setPeso(String(paciente.peso));
    setAltura(String(paciente.altura));
    setEndereco(paciente.endereco);
  }, [paciente]);

  const handleSave = async () => {
    try {
      setSaving(true);

      await fetch(`http://127.0.0.1:8000/paciente/${paciente.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          data_nascimento: dataNascimento,
          peso: parseFloat(peso),
          altura: parseFloat(altura),
          endereco,
        }),
      });

      navigation.navigate("Pacientes");
    } catch (error) {
      console.log("Erro ao salvar paciente:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput value={nome} onChangeText={setNome} style={styles.input} />

      <Text style={styles.label}>Data de nascimento</Text>
      <TextInput
        value={dataNascimento}
        onChangeText={setDataNascimento}
        style={styles.input}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput
        value={peso}
        onChangeText={setPeso}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Altura (m)</Text>
      <TextInput
        value={altura}
        onChangeText={setAltura}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Endereço</Text>
      <TextInput
        value={endereco}
        onChangeText={setEndereco}
        style={styles.input}
      />

      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}

      <Button title="Voltar" onPress={() => navigation.navigate("Pacientes")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
});

export default EditPacienteScreen;
