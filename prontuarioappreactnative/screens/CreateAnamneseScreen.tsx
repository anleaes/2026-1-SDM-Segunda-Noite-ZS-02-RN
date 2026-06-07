import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "CreateAnamnese">;

const CreateAnamneseScreen = ({ navigation }: Props) => {
  const [queixaPrincipal, setQueixaPrincipal] = useState("");
  const [alergias, setAlergias] = useState("");
  const [medicamentos, setMedicamentos] = useState("");
  const [alcool, setAlcool] = useState("NAO");
  const [fumante, setFumante] = useState("NAO");
  const [pacienteId, setPacienteId] = useState("");
  const [medicoId, setMedicoId] = useState("");

  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setQueixaPrincipal("");
      setAlergias("");
      setMedicamentos("");
      setAlcool("NAO");
      setFumante("NAO");
      setPacienteId("");
      setMedicoId("");
    }, []),
  );

  const handleSave = async () => {
    setSaving(true);

    await fetch("http://127.0.0.1:8000/anamnese/api/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        queixa_principal: queixaPrincipal,
        alergias: alergias,
        medicamentos: medicamentos,
        alcool: alcool,
        fumante: fumante,
        paciente: parseInt(pacienteId),
        medico: parseInt(medicoId),
      }),
    });

    navigation.navigate("Anamnese");
    setSaving(false);
  };

  const renderChoiceButton = (
    label: string,
    valor: string,
    estadoAtual: string,
    setEstado: Function,
  ) => (
    <TouchableOpacity
      style={[
        styles.choiceButton,
        estadoAtual === valor && styles.choiceButtonActive,
      ]}
      onPress={() => setEstado(valor)}
    >
      <Text
        style={[
          styles.choiceText,
          estadoAtual === valor && styles.choiceTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>Nova Anamnese</Text>

      <Text style={styles.label}>ID do Paciente</Text>
      <TextInput
        value={pacienteId}
        onChangeText={setPacienteId}
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={styles.label}>ID do Médico</Text>
      <TextInput
        value={medicoId}
        onChangeText={setMedicoId}
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Queixa Principal</Text>
      <TextInput
        value={queixaPrincipal}
        onChangeText={setQueixaPrincipal}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <Text style={styles.label}>Alergias</Text>
      <TextInput
        value={alergias}
        onChangeText={setAlergias}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <Text style={styles.label}>Medicamentos em uso</Text>
      <TextInput
        value={medicamentos}
        onChangeText={setMedicamentos}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <Text style={styles.label}>Consumo de Álcool</Text>
      <View style={styles.choiceContainer}>
        {renderChoiceButton("Não", "NAO", alcool, setAlcool)}
        {renderChoiceButton("Eventual", "EVE", alcool, setAlcool)}
        {renderChoiceButton("Diário", "DIA", alcool, setAlcool)}
      </View>

      <Text style={styles.label}>Fumante</Text>
      <View style={styles.choiceContainer}>
        {renderChoiceButton("Não", "NAO", fumante, setFumante)}
        {renderChoiceButton("Eventual", "EVE", fumante, setFumante)}
        {renderChoiceButton("Diário", "DIA", fumante, setFumante)}
      </View>

      <View style={{ marginTop: 20 }}>
        {saving ? (
          <ActivityIndicator size="large" color="#4B7BE5" />
        ) : (
          <Button
            title="Salvar Anamnese"
            onPress={handleSave}
            color="#4B7BE5"
          />
        )}
      </View>

      <View style={{ marginTop: 10 }}>
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          color="#888"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    alignSelf: "center",
  },
  label: { fontWeight: "600", marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  choiceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  choiceButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 2,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
  },
  choiceButtonActive: { backgroundColor: "#4B7BE5" },
  choiceText: { color: "#333", fontWeight: "bold" },
  choiceTextActive: { color: "#fff" },
});

export default CreateAnamneseScreen;
