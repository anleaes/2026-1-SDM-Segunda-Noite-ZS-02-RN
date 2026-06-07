import { Picker } from "@react-native-picker/picker";
import { DrawerScreenProps } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
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

type Props = DrawerScreenProps<DrawerParamList, "EditAnamnese">;

const EditAnamneseScreen = ({ route, navigation }: Props) => {
  const { anamnese } = route.params;

  // Estados iniciais preenchidos com os dados da anamnese
  const [queixaPrincipal, setQueixaPrincipal] = useState(
    anamnese.queixa_principal,
  );
  const [alergias, setAlergias] = useState(anamnese.alergias);
  const [medicamentos, setMedicamentos] = useState(anamnese.medicamentos);
  const [alcool, setAlcool] = useState(anamnese.alcool);
  const [fumante, setFumante] = useState(anamnese.fumante);
  const [pacienteId, setPacienteId] = useState(anamnese.paciente.toString());
  const [medicoId, setMedicoId] = useState(anamnese.medico.toString());

  // Novos estados para o Picker
  const [listaPacientes, setListaPacientes] = useState<any[]>([]);
  const [listaMedicos, setListaMedicos] = useState<any[]>([]);
  const [loadingDados, setLoadingDados] = useState(true);
  const [saving, setSaving] = useState(false);

  // Garante que os dados se mantenham atualizados caso a rota mude
  useEffect(() => {
    setQueixaPrincipal(anamnese.queixa_principal);
    setAlergias(anamnese.alergias);
    setMedicamentos(anamnese.medicamentos);
    setAlcool(anamnese.alcool);
    setFumante(anamnese.fumante);
    setPacienteId(anamnese.paciente.toString());
    setMedicoId(anamnese.medico.toString());
  }, [anamnese]);

  // Busca as listas usando async/await com try...catch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingDados(true);

        // O Promise.all dispara as duas requisições ao mesmo tempo para ser mais rápido
        const [resPacientes, resMedicos] = await Promise.all([
          fetch("http://127.0.0.1:8000/paciente/api/"),
          fetch("http://127.0.0.1:8000/medico/api/"),
        ]);

        const dataPacientes = await resPacientes.json();
        const dataMedicos = await resMedicos.json();

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

  const handleSave = async () => {
    if (!pacienteId || !medicoId) {
      Alert.alert("Aviso", "Por favor, selecione um paciente e um médico.");
      return;
    }

    setSaving(true);

    try {
      await fetch(`http://127.0.0.1:8000/anamnese/api/${anamnese.id}/`, {
        method: "PUT",
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
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } finally {
      setSaving(false);
    }
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

  // Mostra o loading centralizado enquanto baixa os pacientes e médicos
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
      <Text style={styles.title}>Editar Anamnese</Text>

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
              value={paciente.id.toString()}
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
              value={medico.id.toString()}
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
          <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
        )}
      </View>

      <View style={{ marginTop: 10 }}>
        <Button
          title="Voltar"
          onPress={() => navigation.navigate("Anamnese")}
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

export default EditAnamneseScreen;
