import { Picker } from "@react-native-picker/picker"; // <-- Importado o Picker
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

  // Novos estados para armazenar as listas vindas da API
  const [listaPacientes, setListaPacientes] = useState<any[]>([]);
  const [listaMedicos, setListaMedicos] = useState<any[]>([]);
  const [loadingDados, setLoadingDados] = useState(true);

  const [saving, setSaving] = useState(false);

  // Busca os pacientes e médicos da API quando a tela é carregada
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingDados(true);
        // Busca pacientes
        const resPacientes = await fetch("http://127.0.0.1:8000/paciente/api/");
        const dataPacientes = await resPacientes.json();

        // Busca médicos
        const resMedicos = await fetch("http://127.0.0.1:8000/medico/api/");
        const dataMedicos = await resMedicos.json();

        // O DRF pode retornar uma array direto ou um objeto com a chave "results" se houver paginação
        setListaPacientes(dataPacientes.results || dataPacientes);
        setListaMedicos(dataMedicos.results || dataMedicos);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        Alert.alert(
          "Erro",
          "Não foi possível carregar os pacientes e médicos.",
        );
      } finally {
        setLoadingDados(false);
      }
    };

    fetchData();
  }, []);

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
    if (!pacienteId || !medicoId) {
      Alert.alert("Aviso", "Por favor, selecione um paciente e um médico.");
      return;
    }

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

  if (loadingDados) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#4B7BE5" />
        <Text style={{ textAlign: "center", marginTop: 10 }}>
          Carregando dados...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>Nova Anamnese</Text>

      <Text style={styles.label}>Paciente</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={pacienteId}
          onValueChange={(itemValue) => setPacienteId(itemValue)}
        >
          <Picker.Item label="Selecione um paciente..." value="" />
          {listaPacientes.map((paciente) => (
            <Picker.Item
              key={paciente.id}
              label={paciente.nome}
              value={paciente.id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Médico</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={medicoId}
          onValueChange={(itemValue) => setMedicoId(itemValue)}
        >
          <Picker.Item label="Selecione um médico..." value="" />
          {listaMedicos.map((medico) => (
            <Picker.Item
              key={medico.id}
              label={medico.nome}
              value={medico.id}
            />
          ))}
        </Picker>
      </View>

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
  pickerContainer: {
    // <-- Estilo novo para o Picker parecer com o Input
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
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
