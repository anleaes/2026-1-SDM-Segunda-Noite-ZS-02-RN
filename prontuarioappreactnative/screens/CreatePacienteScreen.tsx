import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "CreatePaciente">;

const CreatePacienteScreen = ({ navigation }: Props) => {
  //específico de paciente
  const [dataNascimento, setDataNascimento] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [endereco, setEndereco] = useState("");
  const [saving, setSaving] = useState(false);

  //herdado de pessoa
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  useFocusEffect(
    useCallback(() => {
      setDataNascimento("");
      setPeso("");
      setAltura("");
      setEndereco("");
      setNome("");
      setSobrenome("");
      setCpf("");
      setTelefone("");
      setEmail("");
    }, []),
  );

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("http://localhost:8000/paciente/api/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dataNascimento,
        peso,
        altura,
        endereco,
        nome,
        sobrenome,
        cpf,
        telefone,
        email,
      }),
    });
    navigation.navigate("Pacientes");
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo paciente</Text>
      <Text style={styles.label}>Nome</Text>
      <TextInput value={nome} onChangeText={setNome} style={styles.input} />
      <Text style={styles.label}>Sobrenome</Text>
      <TextInput
        value={sobrenome}
        onChangeText={setSobrenome}
        style={styles.input}
        multiline
      />
      <Text style={styles.label}>CPF</Text>
      <TextInput value={cpf} onChangeText={setCpf} style={styles.input} />
      <Text style={styles.label}>Telefone</Text>
      <TextInput
        value={telefone}
        onChangeText={setTelefone}
        style={styles.input}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={styles.input} />
      <Text style={styles.label}>Data de nascimento</Text>
      <TextInput
        value={dataNascimento}
        onChangeText={setDataNascimento}
        style={styles.input}
      />
      <Text style={styles.label}>Peso</Text>
      <TextInput
        value={peso}
        onChangeText={setPeso}
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Altura</Text>
      <TextInput
        value={altura}
        onChangeText={setAltura}
        style={styles.input}
        keyboardType="numeric"
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    alignSelf: "center",
  },
  label: {
    fontWeight: "600",
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

export default CreatePacienteScreen;
